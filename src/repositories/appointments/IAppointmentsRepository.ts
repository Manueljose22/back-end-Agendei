import { AccountRole } from "../sessions/ISessionsRepository";

export type appointmentsRequest = {
    patientId: string;
    serviceId: string;
    doctorId: string;
    bookingDate: string;
    bookingHour: string;
}

export type AppointmentAccess = {
    userId: string;
    role: AccountRole;
}

export type appointmentsSave = {
    id: string;
    service: string;
    doctorname: string;
    specialty: string;
    patientname: string;
    patientId: string;
    price: number;
    status: string;
    hospitalname: string;
    hospitalId: string;
    booking_date: Date;
    booking_hour: string;
    idDoctor: string;
    idService: string;
    photo: string | null;
}

export interface IAppointmentsRepository {
    createWithSchedule(data: appointmentsRequest): Promise<void>;
    findAllByPatient(userId: string): Promise<appointmentsSave[] | null>;
    findById(id: string): Promise<appointmentsSave | null>;
    findAll(search: string, access: AppointmentAccess): Promise<appointmentsSave[] | null>;
    update(id: string, data: Pick<appointmentsRequest, "serviceId" | "bookingDate" | "bookingHour">): Promise<void | null>;
    updateWithSchedule(
        id: string,
        data: Pick<appointmentsRequest, "serviceId" | "bookingDate" | "bookingHour">
    ): Promise<void>;
    cancel(id: string, actorRole: AccountRole): Promise<void>;
    confirm(id: string): Promise<void>;

}
