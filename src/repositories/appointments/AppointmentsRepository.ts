import { Prisma } from "@prisma/client";
import { prismaClient } from "../../config/prisma/prismaClient";
import { AppointmentAccess, appointmentsRequest, appointmentsSave, IAppointmentsRepository } from "./IAppointmentsRepository";

export class AppointmentsRepository implements IAppointmentsRepository {
    async save({ patientId, serviceId, doctorId, bookingDate, bookingHour }: appointmentsRequest): Promise<void> {
        await prismaClient.appointment.create({
            data: {
                patientId,
                doctorId,
                serviceId,
                bookingHour,
                bookingDate: new Date(`${bookingDate}T00:00:00Z`)
            }
        });
    }

    async createWithBookedHour(data: appointmentsRequest, timetableId: string): Promise<void> {
        await prismaClient.$transaction(async (transaction) => {
            const doctorService = await transaction.doctor_Service.findUnique({
                where: { doctorId_serviceId: { doctorId: data.doctorId, serviceId: data.serviceId } }
            });

            if (!doctorService) {
                throw new Error("O serviço seleccionado não está associado a este médico.");
            }

            const reservation = await transaction.timetables_Appointment.updateMany({
                where: {
                    id: timetableId,
                    isBooked: false,
                    availability: {
                        is: {
                            doctorId: data.doctorId,
                            date: new Date(`${data.bookingDate}T00:00:00Z`),
                            isBlocked: false
                        }
                    }
                },
                data: { isBooked: true }
            });

            if (reservation.count !== 1) {
                throw new Error("Este horário acabou de ser reservado. Escolha outro horário.");
            }

            await transaction.appointment.create({
                data: {
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    serviceId: data.serviceId,
                    bookingHour: data.bookingHour,
                    bookingDate: new Date(`${data.bookingDate}T00:00:00Z`)
                }
            });
        });
    }


    async createWithSchedule(data: appointmentsRequest): Promise<void> {
        const [year, month, day] = data.bookingDate.split("-").map(Number);
        const [startHour, startMinute] = data.bookingHour.split(":").map(Number);
        const startValue = startHour * 60 + startMinute;
        const date = new Date(Date.UTC(year, month - 1, day));
        const toUtc = (minutes: number) => new Date(Date.UTC(year, month - 1, day, Math.floor(minutes / 60) - 1, minutes % 60));
        const startUtc = toUtc(startValue);
        const lockKey = `appointment:${data.doctorId}:${data.bookingDate}`;

        await prismaClient.$transaction(async (tx) => {
            // Serializa reservas do mesmo médico no mesmo dia para evitar dupla marcação concorrente.
            await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${lockKey}))) SELECT 1::int AS locked FROM lock`;

            const doctor = await tx.doctor.findUnique({
                where: { id: data.doctorId },
                select: { status: true, Hospital: { select: { status: true } }, DoctorSchedule: true }
            });
            if (!doctor || doctor.status !== "ACTIVE" || doctor.Hospital?.status !== "ACTIVE") {
                throw new Error("Médico ou hospital indisponível para agendamentos.");
            }
            const schedule = doctor.DoctorSchedule;
            if (!schedule || !schedule.isActive) throw new Error("O médico ainda não configurou a agenda semanal.");

            const todayParts = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Africa/Luanda", year: "numeric", month: "2-digit", day: "2-digit"
            }).formatToParts(new Date());
            const part = (type: string) => todayParts.find(item => item.type === type)?.value ?? "";
            const today = new Date(`${part("year")}-${part("month")}-${part("day")}T00:00:00.000Z`);
            const latestDate = new Date(today.getTime() + schedule.bookingWindowDays * 86400000);
            if (date < today || date > latestDate) {
                throw new Error("A data está fora do período permitido para agendamentos.");
            }

            const doctorService = await tx.doctor_Service.findUnique({
                where: { doctorId_serviceId: { doctorId: data.doctorId, serviceId: data.serviceId } }
            });
            if (!doctorService) throw new Error("O serviço seleccionado não está associado a este médico.");
            const durationMinutes = doctorService.durationMinutes;
            const endValue = startValue + durationMinutes;
            const endUtc = toUtc(endValue);
            if (endValue > 24 * 60) throw new Error("A consulta não pode ultrapassar o fim do dia.");

            const availability = await tx.availability.findFirst({
                where: {
                    doctorId: data.doctorId,
                    date,
                    isBlocked: false,
                    hourStart: { lte: startUtc },
                    hourEnd: { gte: endUtc },
                    OR: [{ scheduleRuleId: null }, { scheduleRule: { is: { isActive: true } } }]
                },
                select: { id: true }
            });
            if (!availability) throw new Error("O horário seleccionado não cabe num período disponível da agenda.");

            const exceptions = await tx.scheduleException.findMany({
                where: { scheduleId: schedule.id, date },
                select: { type: true, startMinute: true, endMinute: true }
            });
            if (exceptions.some(item => item.type === "BLOCK_DAY")) {
                throw new Error("O médico não está disponível nesta data.");
            }
            if (exceptions.some(item =>
                item.type === "BLOCK_PERIOD" &&
                item.startMinute !== null && item.endMinute !== null &&
                startValue < item.endMinute && endValue > item.startMinute
            )) {
                throw new Error("O horário seleccionado coincide com um período bloqueado.");
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
                    throw new Error("Este horário entra em conflito com outra consulta já marcada.");
                }
            }

            await tx.appointment.create({
                data: {
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    serviceId: data.serviceId,
                    bookingDate: date,
                    bookingHour: data.bookingHour,
                    bookingEnd: `${String(Math.floor(endValue / 60)).padStart(2, "0")}:${String(endValue % 60).padStart(2, "0")}`,
                    durationMinutes
                }
            });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
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
            const current = await tx.appointment.findUnique({
                where: { id },
                select: { doctorId: true, status: true, bookingDate: true }
            });
            if (!current) throw new Error("Consulta não encontrada.");
            if (current.status === "Cancelado") throw new Error("Não é possível alterar uma consulta cancelada.");

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
                throw new Error("Médico ou hospital indisponível para agendamentos.");
            }
            const schedule = doctor.DoctorSchedule;
            if (!schedule || !schedule.isActive) {
                throw new Error("O médico ainda não configurou a agenda semanal.");
            }

            const todayParts = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Africa/Luanda", year: "numeric", month: "2-digit", day: "2-digit"
            }).formatToParts(new Date());
            const part = (type: string) => todayParts.find(item => item.type === type)?.value ?? "";
            const today = new Date(`${part("year")}-${part("month")}-${part("day")}T00:00:00.000Z`);
            const latestDate = new Date(today.getTime() + schedule.bookingWindowDays * 86400000);
            if (date < today || date > latestDate) {
                throw new Error("A data está fora do período permitido para agendamentos.");
            }

            const doctorService = await tx.doctor_Service.findUnique({
                where: { doctorId_serviceId: { doctorId: current.doctorId, serviceId: data.serviceId } }
            });
            if (!doctorService) throw new Error("O serviço seleccionado não está associado a este médico.");

            const durationMinutes = doctorService.durationMinutes;
            const endValue = startValue + durationMinutes;
            if (endValue > 24 * 60) throw new Error("A consulta não pode ultrapassar o fim do dia.");
            const startUtc = toUtc(startValue);
            const endUtc = toUtc(endValue);

            const availability = await tx.availability.findFirst({
                where: {
                    doctorId: current.doctorId,
                    date,
                    isBlocked: false,
                    hourStart: { lte: startUtc },
                    hourEnd: { gte: endUtc },
                    OR: [{ scheduleRuleId: null }, { scheduleRule: { is: { isActive: true } } }]
                },
                select: { id: true }
            });
            if (!availability) {
                throw new Error("O novo horário não cabe num período disponível da agenda.");
            }

            const exceptions = await tx.scheduleException.findMany({
                where: { scheduleId: schedule.id, date },
                select: { type: true, startMinute: true, endMinute: true }
            });
            if (exceptions.some(item => item.type === "BLOCK_DAY")) {
                throw new Error("O médico não está disponível nesta data.");
            }
            if (exceptions.some(item =>
                item.type === "BLOCK_PERIOD" &&
                item.startMinute !== null && item.endMinute !== null &&
                startValue < item.endMinute && endValue > item.startMinute
            )) {
                throw new Error("O horário seleccionado coincide com um período bloqueado.");
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
                    throw new Error("Este horário entra em conflito com outra consulta já marcada.");
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
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    }

    async cancel(id: string): Promise<void> {
        await prismaClient.$transaction(async (tx) => {
            const appointment = await tx.appointment.findUnique({
                where: { id },
                select: { doctorId: true, bookingDate: true, status: true }
            });
            if (!appointment || appointment.status === "Cancelado") {
                throw new Error("A consulta já foi cancelada ou não pode ser actualizada.");
            }

            const date = appointment.bookingDate.toISOString().slice(0, 10);
            const lockKey = `appointment:${appointment.doctorId}:${date}`;
            await tx.$queryRaw<{ locked: number }[]>`WITH lock AS MATERIALIZED (SELECT pg_advisory_xact_lock(hashtext(${lockKey}))) SELECT 1::int AS locked FROM lock`;

            const result = await tx.appointment.updateMany({
                where: { id, status: { not: "Cancelado" } },
                data: { status: "Cancelado", upadatedAt: new Date() }
            });
            if (result.count !== 1) {
                throw new Error("A consulta já foi cancelada ou não pode ser actualizada.");
            }
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    }
}
