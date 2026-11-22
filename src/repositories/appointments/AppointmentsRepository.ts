import { AppError } from "../../errors/AppError";
import { Prisma } from "@prisma/client";
import { prismaClient } from "../../config/prisma/prismaClient";
import { AppointmentAccess, appointmentsRequest, appointmentsSave, IAppointmentsRepository } from "./IAppointmentsRepository";

async function withSerializationRetry<T>(
    operation: () => Promise<T>,
    maxAttempts = 3
): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            const isSerializationConflict =
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2034";

            if (!isSerializationConflict || attempt === maxAttempts) {
                throw error;
            }

            // Pequeno intervalo para permitir que a transacção concorrente termine.
            await new Promise(resolve => setTimeout(resolve, 50 * attempt));
        }
    }

    throw new AppError("Não foi possível concluir a operação após várias tentativas.", 409);
}

export class AppointmentsRepository implements IAppointmentsRepository {
    async createWithSchedule(data: appointmentsRequest): Promise<void> {
        const [year, month, day] = data.bookingDate.split("-").map(Number);
        const [startHour, startMinute] = data.bookingHour.split(":").map(Number);
        const startValue = startHour * 60 + startMinute;
        const date = new Date(Date.UTC(year, month - 1, day));
        const toUtc = (minutes: number) => new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60) - 1, minutes % 60));
        const startUtc = toUtc(startValue);
        const lockKey = `appointment:${data.doctorId}:${data.bookingDate}`;

        await withSerializationRetry(() => prismaClient.$transaction(async (tx) => {
            // Serializa reservas do mesmo médico no mesmo dia para evitar dupla marcação concorrente.
            await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${lockKey}))) SELECT 1::int AS locked FROM lock`;

            const doctor = await tx.doctor.findUnique({
                where: { id: data.doctorId },
                select: { status: true, Hospital: { select: { status: true } }, DoctorSchedule: true }
            });
            if (!doctor || doctor.status !== "ACTIVE" || doctor.Hospital?.status !== "ACTIVE") {
                throw new AppError("Médico ou hospital indisponível para agendamentos.", 409);
            }
            const schedule = doctor.DoctorSchedule;
            if (!schedule || !schedule.isActive) throw new AppError("O médico ainda não configurou a agenda semanal.", 409);

            const todayParts = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Africa/Luanda", year: "numeric", month: "2-digit", day: "2-digit"
            }).formatToParts(new Date());
            const part = (type: string) => todayParts.find(item => item.type === type)?.value ?? "";
            const today = new Date(`${part("year")}-${part("month")}-${part("day")}T00:00:00.000Z`);
            const latestDate = new Date(today.getTime() + schedule.bookingWindowDays * 86400000);
            if (date < today || date > latestDate) {
                throw new AppError("A data está fora do período permitido para agendamentos.", 400);
            }

            const doctorService = await tx.doctor_Service.findUnique({
                where: { doctorId_serviceId: { doctorId: data.doctorId, serviceId: data.serviceId } }
            });
            if (!doctorService) throw new AppError("O serviço seleccionado não está associado a este médico.", 400);
            const durationMinutes = doctorService.durationMinutes;
            const endValue = startValue + durationMinutes;
            const endUtc = toUtc(endValue);
            if (endValue > 24 * 60) throw new AppError("A consulta não pode ultrapassar o fim do dia.", 400);

            const availability = await tx.availability.findFirst({
                where: {
                    doctorId: data.doctorId,
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
            if (!availability) throw new AppError("O horário seleccionado não cabe num período disponível da agenda.", 409);

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
                where: { doctorId: data.doctorId, bookingDate: date, status: { not: "Cancelado" } },
                select: { bookingHour: true, bookingEnd: true, durationMinutes: true, serviceId: true }
            });
            const legacyServiceIds = [...new Set(existing.filter(item => !item.bookingEnd && !item.durationMinutes).map(item => item.serviceId))];
            const legacyDurations = legacyServiceIds.length
                ? await tx.doctor_Service.findMany({
                    where: { doctorId: data.doctorId, serviceId: { in: legacyServiceIds } },
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

            const appointment = await tx.appointment.create({
                data: {
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    serviceId: data.serviceId,
                    bookingDate: date,
                    bookingHour: data.bookingHour,
                    bookingEnd: `${String(Math.floor(endValue / 60)).padStart(2, "0")}:${String(endValue % 60).padStart(2, "0")}`,
                    durationMinutes
                },
                select: { id: true }
            });

            // As notificações internas são gravadas na mesma transacção do agendamento.
            const notificationData = {
                appointmentId: appointment.id,
                type: "APPOINTMENT_CREATED" as const,
                title: "Novo pedido de consulta",
                message: "Foi criado um novo pedido de agendamento.",
                data: { appointmentId: appointment.id }
            };
            await tx.notification.create({
                data: {
                    ...notificationData,
                    recipientRole: "PATIENT",
                    patientId: data.patientId
                }
            });
            await tx.notification.create({
                data: {
                    ...notificationData,
                    recipientRole: "DOCTOR",
                    doctorId: data.doctorId
                }
            });
            if (doctor.Hospital) {
                const hospital = await tx.doctor.findUnique({
                    where: { id: data.doctorId },
                    select: { hospitalId: true }
                });
                if (hospital?.hospitalId) {
                    await tx.notification.create({
                        data: {
                            ...notificationData,
                            recipientRole: "HOSPITAL",
                            hospitalId: hospital.hospitalId
                        }
                    });
                }
            }
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            maxWait: 10_000,
            timeout: 15_000
        }));
    }

    async findById(id: string): Promise<appointmentsSave | null> {
        const appoint = await prismaClient.appointment.findUnique({
            where: { id },
            include: {
                Service: {
                    select: { id: true, title: true, Doctor_Service: { select: { price: true } } }
                },
                Doctor: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        Specialty: { select: { name: true } },
                        Hospital: { select: { id: true, name: true } }
                    }
                },
                Patient: { select: { id: true, name: true } }
            }
        });

        if (!appoint) return null;

        return {
            id: appoint.id,
            status: appoint.status,
            service: appoint.Service.title,
            doctorname: appoint.Doctor.name,
            specialty: appoint.Doctor.Specialty?.name ?? "",
            hospitalname: appoint.Doctor.Hospital?.name ?? "",
            hospitalId: appoint.Doctor.Hospital?.id ?? "",
            photo: appoint.Doctor.photo,
            patientId: appoint.Patient.id,
            patientname: appoint.Patient.name,
            price: appoint.Service.Doctor_Service[0]?.price ?? 0,
            booking_date: appoint.bookingDate,
            booking_hour: appoint.bookingHour,
            idDoctor: appoint.Doctor.id,
            idService: appoint.Service.id
        };
    }

    async findAllByPatient(patientId: string): Promise<appointmentsSave[]> {
        const appointments = await prismaClient.appointment.findMany({
            where: { patientId },
            include: {
                Service: {
                    select: { id: true, title: true, Doctor_Service: { select: { price: true } } }
                },
                Doctor: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        Specialty: { select: { name: true } },
                        Hospital: { select: { id: true, name: true } }
                    }
                },
                Patient: { select: { id: true, name: true } }
            },
            orderBy: { bookingDate: "desc" }
        });

        return appointments.map((item) => ({
            id: item.id,
            status: item.status,
            service: item.Service.title,
            doctorname: item.Doctor.name,
            specialty: item.Doctor.Specialty?.name ?? "",
            patientname: item.Patient.name,
            patientId: item.Patient.id,
            hospitalname: item.Doctor.Hospital?.name ?? "",
            hospitalId: item.Doctor.Hospital?.id ?? "",
            price: item.Service.Doctor_Service[0]?.price ?? 0,
            booking_date: item.bookingDate,
            booking_hour: item.bookingHour,
            idDoctor: item.Doctor.id,
            idService: item.Service.id,
            photo: item.Doctor.photo
        }));
    }

    async findAll(search: string, access: AppointmentAccess): Promise<appointmentsSave[]> {
        const scopeWhere: Prisma.AppointmentWhereInput =
            access.role === "hospital"
                ? { Doctor: { is: { hospitalId: access.userId } } }
                : access.role === "doctor"
                    ? { doctorId: access.userId }
                    : {};

        const searchWhere: Prisma.AppointmentWhereInput = search
            ? { Doctor: { is: { id: { contains: search } } } }
            : {};

        const appointments = await prismaClient.appointment.findMany({
            where: { AND: [scopeWhere, searchWhere] },
            include: {
                Service: {
                    select: { id: true, title: true, Doctor_Service: { select: { price: true } } }
                },
                Doctor: {
                    select: {
                        id: true,
                        name: true,
                        photo: true,
                        Specialty: { select: { name: true } },
                        Hospital: { select: { id: true, name: true } }
                    }
                },
                Patient: { select: { id: true, name: true } }
            },
            orderBy: { bookingDate: "desc" }
        });

        return appointments.map((item) => ({
            id: item.id,
            status: item.status,
            service: item.Service.title,
            doctorname: item.Doctor.name,
            specialty: item.Doctor.Specialty?.name ?? "",
            patientname: item.Patient.name,
            patientId: item.Patient.id,
            hospitalname: item.Doctor.Hospital?.name ?? "",
            hospitalId: item.Doctor.Hospital?.id ?? "",
            price: item.Service.Doctor_Service[0]?.price ?? 0,
            booking_date: item.bookingDate,
            booking_hour: item.bookingHour,
            idDoctor: item.Doctor.id,
            idService: item.Service.id,
            photo: item.Doctor.photo
        }));
    }

    async update(
        id: string,
        { bookingDate, bookingHour, serviceId }: Pick<appointmentsRequest, "bookingDate" | "bookingHour" | "serviceId">
    ): Promise<void> {
        await prismaClient.appointment.update({
            where: { id },
            data: {
                serviceId,
                bookingHour,
                bookingDate: new Date(`${bookingDate}T00:00:00Z`),
                upadatedAt: new Date()
            }
        });
    }

    async updateWithSchedule(
        id: string,
        data: Pick<appointmentsRequest, "serviceId" | "bookingDate" | "bookingHour">
    ): Promise<void> {
        const [year, month, day] = data.bookingDate.split("-").map(Number);
        const [startHour, startMinute] = data.bookingHour.split(":").map(Number);
        const startValue = startHour * 60 + startMinute;
        const date = new Date(Date.UTC(year, month - 1, day));
        const toUtc = (minutes: number) =>
            new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60) - 1, minutes % 60));

        await prismaClient.$transaction(async (tx) => {
            // Serializa alterações concorrentes sobre o mesmo registo antes de o ler.
            const appointmentLockKey = `appointment-record:${id}`;
            await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${appointmentLockKey}))) SELECT 1::int AS locked FROM lock`;

            const current = await tx.appointment.findUnique({
                where: { id },
                select: { doctorId: true, status: true, bookingDate: true }
            });
            if (!current) throw new AppError("Consulta não encontrada.", 404);
            if (current.status === "Cancelado") throw new AppError("Não é possível alterar uma consulta cancelada.", 409);

            // Bloqueia as duas datas por ordem determinística para evitar deadlocks em remarcações.
            const oldDate = current.bookingDate.toISOString().slice(0, 10);
            const lockKeys = [...new Set([oldDate, data.bookingDate])]
                .sort()
                .map(value => `appointment:${current.doctorId}:${value}`);
            for (const lockKey of lockKeys) {
                await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${lockKey}))) SELECT 1::int AS locked FROM lock`;
            }

            const doctor = await tx.doctor.findUnique({
                where: { id: current.doctorId },
                select: { status: true, Hospital: { select: { status: true } }, DoctorSchedule: true }
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

            const doctorService = await tx.doctor_Service.findUnique({
                where: { doctorId_serviceId: { doctorId: current.doctorId, serviceId: data.serviceId } }
            });
            if (!doctorService) throw new AppError("O serviço seleccionado não está associado a este médico.", 400);

            const durationMinutes = doctorService.durationMinutes;
            const endValue = startValue + durationMinutes;
            if (endValue > 24 * 60) throw new AppError("A consulta não pode ultrapassar o fim do dia.", 400);
            const startUtc = toUtc(startValue);
            const endUtc = toUtc(endValue);

            const availability = await tx.availability.findFirst({
                where: {
                    doctorId: current.doctorId,
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
                    doctorId: current.doctorId,
                    bookingDate: date,
                    status: { not: "Cancelado" },
                    id: { not: id }
                },
                select: { bookingHour: true, bookingEnd: true, durationMinutes: true, serviceId: true }
            });
            const legacyServiceIds = [...new Set(
                existing.filter(item => !item.bookingEnd && !item.durationMinutes).map(item => item.serviceId)
            )];
            const legacyDurations = legacyServiceIds.length
                ? await tx.doctor_Service.findMany({
                    where: { doctorId: current.doctorId, serviceId: { in: legacyServiceIds } },
                    select: { serviceId: true, durationMinutes: true }
                })
                : [];
            const durationByService = new Map(legacyDurations.map(item => [item.serviceId, item.durationMinutes]));

            for (const item of existing) {
                const [h, m] = item.bookingHour.split(":").map(Number);
                const existingStart = h * 60 + m;
                const existingDuration = item.durationMinutes ?? durationByService.get(item.serviceId) ?? 45;
                const existingEnd = item.bookingEnd
                    ? (() => {
                        const [eh, em] = item.bookingEnd!.split(":").map(Number);
                        return eh * 60 + em;
                    })()
                    : existingStart + existingDuration;

                if (startValue < existingEnd && endValue > existingStart) {
                    throw new AppError("Este horário entra em conflito com outra consulta já marcada.", 409);
                }
            }

            await tx.appointment.update({
                where: { id },
                data: {
                    serviceId: data.serviceId,
                    bookingDate: date,
                    bookingHour: data.bookingHour,
                    bookingEnd: `${String(Math.floor(endValue / 60)).padStart(2, "0")}:${String(endValue % 60).padStart(2, "0")}`,
                    durationMinutes,
                    upadatedAt: new Date()
                }
            });
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            maxWait: 10_000,
            timeout: 15_000
        });
    }

    async confirm(id: string): Promise<void> {
        await prismaClient.$transaction(async (tx) => {
            const lockKey = `appointment-record:${id}`;
            await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${lockKey}))) SELECT 1::int AS locked FROM lock`;

            const appointment = await tx.appointment.findUnique({
                where: { id },
                select: { patientId: true, status: true }
            });
            if (!appointment) throw new AppError("Consulta não encontrada.", 404);
            if (appointment.status !== "Pendente") {
                throw new AppError("Apenas consultas pendentes podem ser confirmadas.", 409);
            }

            const updated = await tx.appointment.updateMany({
                where: { id, status: "Pendente" },
                data: { status: "Confirmado", upadatedAt: new Date() }
            });
            if (updated.count !== 1) throw new AppError("A consulta já foi actualizada.", 409);

            await tx.notification.create({
                data: {
                    appointmentId: id,
                    recipientRole: "PATIENT",
                    patientId: appointment.patientId,
                    type: "APPOINTMENT_CONFIRMED",
                    title: "Consulta confirmada",
                    message: "A sua consulta foi confirmada pelo médico ou hospital.",
                    data: { appointmentId: id }
                }
            });
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            maxWait: 10_000,
            timeout: 15_000
        });
    }

    async cancel(id: string, actorRole: "platform_admin" | "hospital" | "doctor" | "patient"): Promise<void> {
        await prismaClient.$transaction(async (tx) => {
            // Serializa cancelamentos e remarcações da mesma consulta.
            const appointmentLockKey = `appointment-record:${id}`;
            await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${appointmentLockKey}))) SELECT 1::int AS locked FROM lock`;

            const appointment = await tx.appointment.findUnique({
                where: { id },
                select: { doctorId: true, bookingDate: true, status: true, patientId: true, Doctor: { select: { hospitalId: true } } }
            });
            if (!appointment || appointment.status === "Cancelado") {
                throw new AppError("A consulta já foi cancelada ou não pode ser actualizada.", 409);
            }

            const date = appointment.bookingDate.toISOString().slice(0, 10);
            const lockKey = `appointment:${appointment.doctorId}:${date}`;
            await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${lockKey}))) SELECT 1::int AS locked FROM lock`;

            const result = await tx.appointment.updateMany({
                where: { id, status: { not: "Cancelado" } },
                data: { status: "Cancelado", upadatedAt: new Date() }
            });
            if (result.count !== 1) {
                throw new AppError("A consulta já foi cancelada ou não pode ser actualizada.", 409);
            }

            // O cancelamento e as notificações são confirmados ou revertidos juntos.
            if (actorRole === "patient") {
                await tx.notification.create({
                    data: {
                        appointmentId: id,
                        recipientRole: "DOCTOR",
                        doctorId: appointment.doctorId,
                        type: "APPOINTMENT_CANCELLED",
                        title: "Consulta cancelada pelo paciente",
                        message: "O paciente cancelou a consulta agendada.",
                        data: { appointmentId: id }
                    }
                });
                if (appointment.Doctor.hospitalId) {
                    await tx.notification.create({
                        data: {
                            appointmentId: id,
                            recipientRole: "HOSPITAL",
                            hospitalId: appointment.Doctor.hospitalId,
                            type: "APPOINTMENT_CANCELLED",
                            title: "Consulta cancelada pelo paciente",
                            message: "Um paciente cancelou uma consulta do hospital.",
                            data: { appointmentId: id }
                        }
                    });
                }
            } else {
                await tx.notification.create({
                    data: {
                        appointmentId: id,
                        recipientRole: "PATIENT",
                        patientId: appointment.patientId,
                        type: "APPOINTMENT_CANCELLED",
                        title: "Consulta cancelada",
                        message: "A sua consulta foi cancelada pelo médico ou hospital.",
                        data: { appointmentId: id }
                    }
                });
            }
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            maxWait: 10_000,
            timeout: 15_000
        });
    }
}
