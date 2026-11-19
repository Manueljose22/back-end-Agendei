import { AppError } from "../../errors/AppError";
import { DoctorStatus } from "@prisma/client";
import { prismaClient } from "../../config/prisma/prismaClient";

type Actor = { id: string; role: string };
type ExceptionInput = {
    date: string;
    type: "BLOCK_DAY" | "BLOCK_PERIOD" | "EXTRA_PERIOD";
    startTime?: string;
    endTime?: string;
    reason?: string;
};

function dateOnly(value: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new AppError("A data deve estar no formato YYYY-MM-DD.", 400);
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new AppError("Data inválida.", 400);
    return date;
}

function minute(value?: string): number | null {
    if (value === undefined) return null;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new AppError("A hora deve estar no formato HH:mm.", 400);
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
}

function isoWeekday(date: Date): number {
    return date.getUTCDay() || 7;
}

function localDateAtMinute(date: Date, value: number): Date {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    // Luanda uses UTC+1 and has no daylight-saving transition.
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hours - 1, minutes));
}

function todayInLuanda(): Date {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Luanda", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const get = (type: string) => parts.find(part => part.type === type)?.value ?? "";
    return dateOnly(`${get("year")}-${get("month")}-${get("day")}`);
}

function assertManager(actor: Actor, doctor: { id: string; hospitalId: string | null; status: DoctorStatus; Hospital: { status: string } | null }) {
    if (actor.role === "doctor" && actor.id !== doctor.id) throw new AppError("Só pode gerir a sua própria agenda.", 403);
    if (actor.role === "hospital" && actor.id !== doctor.hospitalId) throw new AppError("Este médico não pertence ao seu hospital.", 403);
    if (!["doctor", "hospital", "platform_admin"].includes(actor.role)) throw new AppError("Não tem permissões para gerir agendas.", 403);
    if (actor.role !== "platform_admin" && (doctor.status !== "ACTIVE" || doctor.Hospital?.status !== "ACTIVE")) {
        throw new AppError("O médico ou hospital não está activo.", 409);
    }
}

export class DoctorAvailabilityService {
    async generateAndList(doctorId: string, from?: string, to?: string) {
        const doctor = await prismaClient.doctor.findUnique({
            where: { id: doctorId },
            select: { id: true, status: true, Hospital: { select: { status: true } },
                DoctorSchedule: { include: { rules: { where: { isActive: true } }, exceptions: { where: { isActive: true } } } } }
        });
        if (!doctor || doctor.status !== "ACTIVE" || doctor.Hospital?.status !== "ACTIVE") {
            throw new AppError("Médico ou hospital indisponível.", 409);
        }
        const schedule = doctor.DoctorSchedule;
        if (!schedule || !schedule.isActive) return { availabilities: [], exceptions: [] };

        const start = from ? dateOnly(from) : todayInLuanda();
        const end = to ? dateOnly(to) : new Date(start.getTime() + schedule.bookingWindowDays * 86400000);
        if (end < start || (end.getTime() - start.getTime()) / 86400000 > 365) {
            throw new AppError("O intervalo deve ser válido e não pode ultrapassar 365 dias.", 400);
        }

        const exceptionByDate = new Map<string, typeof schedule.exceptions>();
        for (const item of schedule.exceptions) {
            const key = item.date.toISOString().slice(0, 10);
            exceptionByDate.set(key, [...(exceptionByDate.get(key) ?? []), item]);
        }
        const rows: Array<{ doctorId: string; date: Date; hourStart: Date; hourEnd: Date; scheduleRuleId: string | null; scheduleExceptionId: string | null }> = [];

        for (let cursor = new Date(start); cursor <= end; cursor = new Date(cursor.getTime() + 86400000)) {
            const dateKey = cursor.toISOString().slice(0, 10);
            const dayExceptions = exceptionByDate.get(dateKey) ?? [];
            if (dayExceptions.some(item => item.type === "BLOCK_DAY")) continue;

            for (const rule of schedule.rules) {
                if (rule.weekday !== isoWeekday(cursor)) continue;
                if (rule.effectiveFrom && cursor < rule.effectiveFrom) continue;
                if (rule.effectiveUntil && cursor > rule.effectiveUntil) continue;
                rows.push({
                    doctorId, date: new Date(cursor),
                    hourStart: localDateAtMinute(cursor, rule.startMinute),
                    hourEnd: localDateAtMinute(cursor, rule.endMinute),
                    scheduleRuleId: rule.id,
                    scheduleExceptionId: null
                });
            }

            for (const exception of dayExceptions) {
                if (exception.type !== "EXTRA_PERIOD" || exception.startMinute === null || exception.endMinute === null) continue;
                rows.push({
                    doctorId, date: new Date(cursor),
                    hourStart: localDateAtMinute(cursor, exception.startMinute),
                    hourEnd: localDateAtMinute(cursor, exception.endMinute),
                    scheduleRuleId: null,
                    scheduleExceptionId: exception.id
                });
            }
        }

        if (rows.length) {
            await prismaClient.$transaction(async tx => {
                const rowsToCreate: typeof rows = [];

                for (const row of rows) {
                    const existing = await tx.availability.updateMany({
                        where: {
                            doctorId: row.doctorId,
                            date: row.date,
                            hourStart: row.hourStart,
                            hourEnd: row.hourEnd
                        },
                        data: {
                            scheduleRuleId: row.scheduleRuleId,
                            scheduleExceptionId: row.scheduleExceptionId
                        }
                    });

                    if (existing.count === 0) {
                        rowsToCreate.push(row);
                    }
                }

                if (rowsToCreate.length) {
                    await tx.availability.createMany({
                        data: rowsToCreate,
                        skipDuplicates: true
                    });
                }
            }, {
                isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
            });
        }

        const blockedDates = schedule.exceptions.filter(item => item.type === "BLOCK_DAY").map(item => item.date);
        const availabilities = await prismaClient.availability.findMany({
            where: { doctorId, isBlocked: false, date: { gte: start, lte: end, notIn: blockedDates },
                OR: [
                    { scheduleRuleId: null, scheduleExceptionId: null },
                    { scheduleRule: { is: { isActive: true } } },
                    { scheduleException: { is: { isActive: true } } }
                ] },
            orderBy: [{ date: "asc" }, { hourStart: "asc" }]
        });
        const exceptions = schedule.exceptions.filter(item => item.date >= start && item.date <= end);
        return { availabilities, exceptions };
    }

    async addException(doctorId: string, actor: Actor, input: ExceptionInput) {
        const doctor = await prismaClient.doctor.findUnique({
            where: { id: doctorId },
            select: { id: true, hospitalId: true, status: true, Hospital: { select: { status: true } } }
        });
        if (!doctor) throw new AppError("Médico não encontrado.", 404);
        assertManager(actor, doctor);

        const date = dateOnly(input.date);
        const startMinute = minute(input.startTime);
        const endMinute = minute(input.endTime);
        if (input.type === "BLOCK_DAY") {
            if (startMinute !== null || endMinute !== null) throw new AppError("BLOCK_DAY não deve receber horários.", 400);
        } else if (startMinute === null || endMinute === null || startMinute >= endMinute) {
            throw new AppError("Esta excepção exige um período válido com início anterior ao fim.", 400);
        }

        const schedule = await prismaClient.doctorSchedule.findUnique({
            where: { doctorId },
            include: {
                rules: { where: { isActive: true } },
                exceptions: { where: { date, isActive: true } }
            }
        });
        if (!schedule) throw new AppError("Configure primeiro a agenda semanal do médico.", 400);

        if (input.type === "EXTRA_PERIOD") {
            const weekday = isoWeekday(date);
            const overlapsWeeklyRule = schedule.rules.some(rule =>
                rule.weekday === weekday &&
                (!rule.effectiveFrom || date >= rule.effectiveFrom) &&
                (!rule.effectiveUntil || date <= rule.effectiveUntil) &&
                startMinute! < rule.endMinute &&
                endMinute! > rule.startMinute
            );
            const overlapsExtraException = schedule.exceptions.some(exception =>
                exception.type === "EXTRA_PERIOD" &&
                exception.startMinute !== null &&
                exception.endMinute !== null &&
                startMinute! < exception.endMinute &&
                endMinute! > exception.startMinute
            );
            const overlapsLegacyAvailability = await prismaClient.availability.findFirst({
                where: {
                    doctorId,
                    date,
                    scheduleRuleId: null,
                    scheduleExceptionId: null,
                    hourStart: { lt: localDateAtMinute(date, endMinute!) },
                    hourEnd: { gt: localDateAtMinute(date, startMinute!) }
                },
                select: { id: true }
            });

            if (overlapsWeeklyRule || overlapsExtraException || overlapsLegacyAvailability) {
                throw new AppError("O período extraordinário sobrepõe-se a uma disponibilidade existente.", 409);
            }
        }

        return prismaClient.scheduleException.create({
            data: { scheduleId: schedule.id, date, type: input.type,
                startMinute, endMinute, reason: input.reason?.trim() || null }
        });
    }

    async removeException(doctorId: string, exceptionId: string, actor: Actor) {
        const doctor = await prismaClient.doctor.findUnique({
            where: { id: doctorId },
            select: { id: true, hospitalId: true, status: true, Hospital: { select: { status: true } } }
        });
        if (!doctor) throw new AppError("Médico não encontrado.", 404);
        assertManager(actor, doctor);
        const result = await prismaClient.scheduleException.updateMany({
            where: { id: exceptionId, isActive: true, schedule: { is: { doctorId } } },
            data: { isActive: false }
        });
        if (result.count !== 1) throw new AppError("Excepção não encontrada ou já removida.", 404);
    }
}
