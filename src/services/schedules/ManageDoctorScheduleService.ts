import { Prisma } from "@prisma/client";
import { prismaClient } from "../../config/prisma/prismaClient";

type ScheduleRuleInput = {
    weekday: number;
    startTime: string;
    endTime: string;
    effectiveFrom?: string | null;
    effectiveUntil?: string | null;
};

type Actor = { id: string; role: string };

function parseTime(value: string): number {
    if (!/^([01]\\d|2[0-3]):[0-5]\\d$/.test(value)) {
        throw new Error("Os horários devem estar no formato HH:mm.");
    }
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
}

function parseDate(value?: string | null): Date | null {
    if (!value) return null;
    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {
        throw new Error("As datas devem estar no formato YYYY-MM-DD.");
    }
    const date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        throw new Error("Foi indicada uma data inválida.");
    }
    return date;
}

export class ManageDoctorScheduleService {
    async get(doctorId: string) {
        const doctor = await prismaClient.doctor.findUnique({
            where: { id: doctorId },
            select: {
                id: true,
                status: true,
                Hospital: { select: { status: true } },
                DoctorSchedule: {
                    include: {
                        rules: { orderBy: [{ weekday: "asc" }, { startMinute: "asc" }] },
                        exceptions: { orderBy: { date: "asc" } }
                    }
                }
            }
        });

        if (!doctor || doctor.status !== "activo" || doctor.Hospital?.status !== "ACTIVE") {
            throw new Error("Médico ou hospital indisponível.");
        }

        return doctor.DoctorSchedule;
    }

    async replaceRules(doctorId: string, actor: Actor, rules: ScheduleRuleInput[], bookingWindowDays?: number) {
        if (!Array.isArray(rules)) throw new Error("Envie uma lista de períodos semanais.");
        if (bookingWindowDays !== undefined &&
            (!Number.isInteger(bookingWindowDays) || bookingWindowDays < 1 || bookingWindowDays > 365)) {
            throw new Error("O horizonte de agendamento deve estar entre 1 e 365 dias.");
        }

        const doctor = await prismaClient.doctor.findUnique({
            where: { id: doctorId },
            select: { id: true, hospitalId: true, status: true, Hospital: { select: { status: true } } }
        });
        if (!doctor) throw new Error("Médico não encontrado.");

        if (actor.role === "doctor" && actor.id !== doctorId) {
            throw new Error("Só pode gerir a sua própria agenda.");
        }
        if (actor.role === "hospital" && doctor.hospitalId !== actor.id) {
            throw new Error("Este médico não pertence ao seu hospital.");
        }
        if (actor.role !== "platform_admin" && actor.role !== "doctor" && actor.role !== "hospital") {
            throw new Error("Não tem permissões para gerir agendas.");
        }
        if (actor.role !== "platform_admin" &&
            (doctor.status !== "activo" || doctor.Hospital?.status !== "ACTIVE")) {
            throw new Error("O médico ou hospital não está activo.");
        }

        const normalized = rules.map(rule => {
            if (!Number.isInteger(rule.weekday) || rule.weekday < 1 || rule.weekday > 7) {
                throw new Error("O dia da semana deve estar entre 1 (segunda) e 7 (domingo).");
            }
            const startMinute = parseTime(rule.startTime);
            const endMinute = parseTime(rule.endTime);
            if (startMinute >= endMinute) {
                throw new Error("A hora inicial deve ser anterior à hora final.");
            }
            const effectiveFrom = parseDate(rule.effectiveFrom);
            const effectiveUntil = parseDate(rule.effectiveUntil);
            if (effectiveFrom && effectiveUntil && effectiveFrom > effectiveUntil) {
                throw new Error("A data inicial não pode ser posterior à data final.");
            }
            return { weekday: rule.weekday, startMinute, endMinute, effectiveFrom, effectiveUntil };
        });

        const byDay = new Map<number, typeof normalized>();
        for (const rule of normalized) {
            const dayRules = byDay.get(rule.weekday) ?? [];
            dayRules.push(rule);
            byDay.set(rule.weekday, dayRules);
        }
        for (const dayRules of byDay.values()) {
            dayRules.sort((a, b) => a.startMinute - b.startMinute);
            for (let i = 1; i < dayRules.length; i++) {
                if (dayRules[i].startMinute < dayRules[i - 1].endMinute) {
                    throw new Error("Existem períodos sobrepostos no mesmo dia da semana.");
                }
            }
        }

        return prismaClient.$transaction(async tx => {
            const schedule = await tx.doctorSchedule.upsert({
                where: { doctorId },
                create: {
                    doctorId,
                    bookingWindowDays: bookingWindowDays ?? 90,
                    timezone: "Africa/Luanda"
                },
                update: {
                    ...(bookingWindowDays !== undefined ? { bookingWindowDays } : {}),
                    isActive: true
                }
            });

            // Substituir regras não remove consultas nem disponibilidades já materializadas.
            await tx.scheduleRule.deleteMany({ where: { scheduleId: schedule.id } });
            if (normalized.length) {
                await tx.scheduleRule.createMany({
                    data: normalized.map(rule => ({ ...rule, scheduleId: schedule.id }))
                });
            }

            return tx.doctorSchedule.findUnique({
                where: { id: schedule.id },
                include: {
                    rules: { orderBy: [{ weekday: "asc" }, { startMinute: "asc" }] },
                    exceptions: { orderBy: { date: "asc" } }
                }
            });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    }
}
