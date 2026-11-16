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
                where: {
                    doctorId_serviceId: {
                        doctorId: data.doctorId,
                        serviceId: data.serviceId
                    }
                }
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

    async findById(id: string): Promise<appointmentsSave | null> {
        const appoint = await prismaClient.appointment.findUnique({
            where: { id },
            include: {
                Service: {
                    select: {
                        id: true,
                        title: true,
                        Doctor_Service: { select: { price: true } }
                    }
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
                    select: {
                        id: true,
                        title: true,
                        Doctor_Service: { select: { price: true } }
                    }
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
                    select: {
                        id: true,
                        title: true,
                        Doctor_Service: { select: { price: true } }
                    }
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

    async cancel(id: string): Promise<void> {
        await prismaClient.appointment.update({
            where: { id },
            data: { status: "Cancelado" }
        });
    }
}
