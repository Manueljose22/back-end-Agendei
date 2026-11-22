import { Prisma, RescheduleActorRole } from "@prisma/client";
import { prismaClient } from "../../config/prisma/prismaClient";
import { AppError } from "../../errors/AppError";

export type CreateRescheduleProposalInput = {
    appointmentId: string;
    proposedById: string;
    proposedByRole: "doctor" | "hospital";
    proposedDate: string;
    proposedHour: string;
    reason?: string;
};

export type RespondToRescheduleProposalInput = {
    proposalId: string;
    patientId: string;
    decision: "accept" | "reject";
};

type Transaction = Prisma.TransactionClient;

export class RescheduleProposalsRepository {
    private async lock(tx: Transaction, key: string): Promise<void> {
        await tx.$queryRaw<{ locked: number }[]> `WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${key}))) SELECT 1::int AS locked FROM lock`;
    }

    private async validateSlot(
        tx: Transaction,
        appointment: { id: string; doctorId: string; serviceId: string; status: string; bookingDate: Date },
        date: Date,
        hour: string,
        durationMinutes: number
    ): Promise<string> {
        if (appointment.status === "Cancelado") {
            throw new AppError("Não é possível reagendar uma consulta cancelada.", 409);
        }

        const [year, month, day] = date.toISOString().slice(0, 10).split("-").map(Number);
        const [startHour, startMinute] = hour.split(":").map(Number);
        const startValue = startHour * 60 + startMinute;
        const endValue = startValue + durationMinutes;
        if (endValue > 24 * 60) throw new AppError("A consulta não pode ultrapassar o fim do dia.", 400);

        const toUtc = (minutes: number) =>
            new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60) - 1, minutes % 60));
        const startUtc = toUtc(startValue);
        const endUtc = toUtc(endValue);

        const doctor = await tx.doctor.findUnique({
            where: { id: appointment.doctorId },
            select: {
                status: true,
                Hospital: { select: { id: true, status: true } },
                DoctorSchedule: true
            }
        });
        if (!doctor || doctor.status !== "ACTIVE" || doctor.Hospital?.status !== "ACTIVE") {
            throw new AppError("Médico ou hospital indisponível para agendamentos.", 409);
        }
        const schedule = doctor.DoctorSchedule;
        if (!schedule || !schedule.isActive) {
            throw new AppError("O médico ainda não configurou a agenda semanal.", 409);
        }

        const todayParts = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Africa/Luanda", year: "numeric", month: "2-digit", day: "2-digit"
        }).formatToParts(new Date());
        const part = (type: string) => todayParts.find(item => item.type === type)?.value ?? "";
        const today = new Date(`${part("year")}-${part("month")}-${part("day")}T00:00:00.000Z`);
        const latestDate = new Date(today.getTime() + schedule.bookingWindowDays * 86400000);
        if (date < today || date > latestDate) {
            throw new AppError("A data está fora do período permitido para agendamentos.", 400);
        }

        const availability = await tx.availability.findFirst({
            where: {
                doctorId: appointment.doctorId,
                date,
                isBlocked: false,
                hourStart: { lte: startUtc },
                hourEnd: { gte: endUtc },
                OR: [
                    { scheduleRuleId: null, scheduleExceptionId: null },
                    { scheduleRule: { is: { isActive: true } } },
                    { scheduleException: { is: { isActive: true } } }
                ]
            },
            select: { id: true }
        });
        if (!availability) {
            throw new AppError("O novo horário não cabe num período disponível da agenda.", 409);
        }

        const exceptions = await tx.scheduleException.findMany({
            where: { scheduleId: schedule.id, date, isActive: true },
            select: { type: true, startMinute: true, endMinute: true }
        });
        if (exceptions.some(item => item.type === "BLOCK_DAY")) {
            throw new AppError("O médico não está disponível nesta data.", 409);
        }
        if (exceptions.some(item =>
            item.type === "BLOCK_PERIOD" &&
            item.startMinute !== null && item.endMinute !== null &&
            startValue < item.endMinute && endValue > item.startMinute
        )) {
            throw new AppError("O horário seleccionado coincide com um período bloqueado.", 409);
        }

        const existing = await tx.appointment.findMany({
            where: {
                doctorId: appointment.doctorId,
                bookingDate: date,
                status: { not: "Cancelado" },
                id: { not: appointment.id }
            },
            select: { bookingHour: true, bookingEnd: true, durationMinutes: true, serviceId: true }
        });
        const legacyIds = [...new Set(existing.filter(item => !item.bookingEnd && !item.durationMinutes).map(item => item.serviceId))];
        const legacyDurations = legacyIds.length
            ? await tx.doctor_Service.findMany({
                where: { doctorId: appointment.doctorId, serviceId: { in: legacyIds } },
                select: { serviceId: true, durationMinutes: true }
            })
            : [];
        const durationByService = new Map(legacyDurations.map(item => [item.serviceId, item.durationMinutes]));

        for (const item of existing) {
            const [h, m] = item.bookingHour.split(":").map(Number);
            const existingStart = h * 60 + m;
            const existingDuration = item.durationMinutes ?? durationByService.get(item.serviceId) ?? 45;
            const existingEnd = item.bookingEnd
                ? (() => { const [eh, em] = item.bookingEnd!.split(":").map(Number); return eh * 60 + em; })()
                : existingStart + existingDuration;
            if (startValue < existingEnd && endValue > existingStart) {
                throw new AppError("Este horário entra em conflito com outra consulta já marcada.", 409);
            }
        }

        return `${String(Math.floor(endValue / 60)).padStart(2, "0")}:${String(endValue % 60).padStart(2, "0")}`;
    }

    async create(input: CreateRescheduleProposalInput): Promise<{ id: string }> {
        const [year, month, day] = input.proposedDate.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        const [hour, minute] = input.proposedHour.split(":").map(Number);
        const startValue = hour * 60 + minute;
        const dateKey = input.proposedDate;

        try {
            return await prismaClient.$transaction(async tx => {
                await this.lock(tx, `appointment-record:${input.appointmentId}`);
                const appointment = await tx.appointment.findUnique({
                    where: { id: input.appointmentId },
                    select: {
                        id: true, patientId: true, doctorId: true, serviceId: true,
                        status: true, bookingDate: true,
                        Doctor: { select: { hospitalId: true } }
                    }
                });
                if (!appointment) throw new AppError("Consulta não encontrada.", 404);
                if (appointment.status === "Cancelado") throw new AppError("Não é possível reagendar uma consulta cancelada.", 409);
                const authorized = input.proposedByRole === "doctor"
                    ? appointment.doctorId === input.proposedById
                    : appointment.Doctor.hospitalId === input.proposedById;
                if (!authorized) throw new AppError("Não tem permissão para propor o reagendamento desta consulta.", 403);

                const pending = await tx.rescheduleProposal.findFirst({
                    where: { appointmentId: input.appointmentId, status: "PENDING" },
                    select: { id: true }
                });
                if (pending) throw new AppError("Já existe uma proposta de reagendamento pendente para esta consulta.", 409);

                const service = await tx.doctor_Service.findUnique({
                    where: { doctorId_serviceId: { doctorId: appointment.doctorId, serviceId: appointment.serviceId } },
                    select: { durationMinutes: true }
                });
                if (!service) throw new AppError("O serviço já não está associado a este médico.", 409);
                const durationMinutes = service.durationMinutes;

                const lockDates = [...new Set([
                    appointment.bookingDate.toISOString().slice(0, 10),
                    dateKey
                ])].sort();
                for (const lockDate of lockDates) {
                    await this.lock(tx, `appointment:${appointment.doctorId}:${lockDate}`);
                }
                const proposedEnd = await this.validateSlot(
                    tx, appointment, date, input.proposedHour, durationMinutes
                );

                const proposal = await tx.rescheduleProposal.create({
                    data: {
                        appointmentId: input.appointmentId,
                        proposedById: input.proposedById,
                        proposedByRole: input.proposedByRole as RescheduleActorRole,
                        proposedDate: date,
                        proposedHour: input.proposedHour,
                        proposedEnd,
                        durationMinutes,
                        reason: input.reason?.trim() || null
                    },
                    select: { id: true }
                });

                await tx.notification.create({
                    data: {
                        appointmentId: appointment.id,
                        rescheduleProposalId: proposal.id,
                        recipientRole: "PATIENT",
                        patientId: appointment.patientId,
                        type: "RESCHEDULE_PROPOSED",
                        title: "Proposta de reagendamento",
                        message: `Foi proposta uma nova data para a sua consulta: ${dateKey} às ${input.proposedHour}.`,
                        data: {
                            appointmentId: appointment.id,
                            proposalId: proposal.id,
                            proposedDate: dateKey,
                            proposedHour: input.proposedHour,
                            reason: input.reason?.trim() || null
                        }
                    }
                });
                return proposal;
            }, {
                isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
                maxWait: 10000,
                timeout: 15000
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new AppError("Já existe uma proposta de reagendamento pendente para esta consulta.", 409);
            }
            throw error;
        }
    }

    async respond(input: RespondToRescheduleProposalInput): Promise<void> {
        await prismaClient.$transaction(async tx => {
            const proposal = await tx.rescheduleProposal.findUnique({
                where: { id: input.proposalId },
                include: {
                    appointment: {
                        select: {
                            id: true, patientId: true, doctorId: true, serviceId: true,
                            status: true, bookingDate: true,
                            Doctor: { select: { hospitalId: true } }
                        }
                    }
                }
            });
            if (!proposal) throw new AppError("Proposta de reagendamento não encontrada.", 404);
            await this.lock(tx, `appointment-record:${proposal.appointmentId}`);

            const current = await tx.rescheduleProposal.findUnique({
                where: { id: input.proposalId },
                select: { status: true, proposedDate: true, proposedHour: true, proposedEnd: true, durationMinutes: true }
            });
            if (!current) throw new AppError("Proposta de reagendamento não encontrada.", 404);
            if (proposal.appointment.patientId !== input.patientId) {
                throw new AppError("Não tem permissão para responder a esta proposta.", 403);
            }
            if (current.status !== "PENDING") {
                throw new AppError("Esta proposta já foi respondida.", 409);
            }
            if (proposal.appointment.status === "Cancelado") {
                throw new AppError("A consulta foi cancelada e já não pode ser reagendada.", 409);
            }

            if (input.decision === "accept") {
                const dateKey = current.proposedDate.toISOString().slice(0, 10);
                const oldDate = proposal.appointment.bookingDate.toISOString().slice(0, 10);
                for (const lockDate of [...new Set([oldDate, dateKey])].sort()) {
                    await this.lock(tx, `appointment:${proposal.appointment.doctorId}:${lockDate}`);
                }
                const proposedEnd = await this.validateSlot(
                    tx,
                    proposal.appointment,
                    current.proposedDate,
                    current.proposedHour,
                    current.durationMinutes
                );

                await tx.appointment.update({
                    where: { id: proposal.appointmentId },
                    data: {
                        bookingDate: current.proposedDate,
                        bookingHour: current.proposedHour,
                        bookingEnd: proposedEnd,
                        durationMinutes: current.durationMinutes,
                        upadatedAt: new Date()
                    }
                });
            }

            await tx.rescheduleProposal.update({
                where: { id: input.proposalId },
                data: {
                    status: input.decision === "accept" ? "ACCEPTED" : "REJECTED",
                    respondedAt: new Date()
                }
            });

            const doctorId = proposal.appointment.doctorId;
            const hospitalId = proposal.appointment.Doctor.hospitalId;
            const accepted = input.decision === "accept";
            const type = accepted ? "RESCHEDULE_ACCEPTED" : "RESCHEDULE_REJECTED";
            const title = accepted ? "Reagendamento aceite" : "Reagendamento recusado";
            const message = accepted
                ? "O paciente aceitou a proposta de reagendamento."
                : "O paciente recusou a proposta de reagendamento.";

            await tx.notification.create({
                data: {
                    appointmentId: proposal.appointmentId,
                    rescheduleProposalId: input.proposalId,
                    recipientRole: "DOCTOR",
                    doctorId,
                    type,
                    title,
                    message,
                    data: { appointmentId: proposal.appointmentId, proposalId: input.proposalId, decision: input.decision }
                }
            });
            if (hospitalId) {
                await tx.notification.create({
                    data: {
                        appointmentId: proposal.appointmentId,
                        rescheduleProposalId: input.proposalId,
                        recipientRole: "HOSPITAL",
                        hospitalId,
                        type,
                        title,
                        message,
                        data: { appointmentId: proposal.appointmentId, proposalId: input.proposalId, decision: input.decision }
                    }
                });
            }
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            maxWait: 10000,
            timeout: 15000
        });
    }
}
