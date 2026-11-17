import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { DoctorAvailabilityService } from "../schedules/DoctorAvailabilityService";

class UpdateAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute(
        id: string,
        data: Partial<Pick<appointmentsRequest, "bookingDate" | "bookingHour" | "serviceId">>,
        userId: string,
        role: AccountRole
    ): Promise<void> {
        const appointment = await this.appointmentsRepository.findById(id);

        if (!appointment) throw new Error("Consulta não encontrada.");
        if (appointment.status.toLowerCase() === "cancelado") {
            throw new Error("Não é possível alterar uma consulta cancelada.");
        }

        const canManage =
            role === "platform_admin" ||
            (role === "patient" && appointment.patientId === userId) ||
            (role === "doctor" && appointment.idDoctor === userId) ||
            (role === "hospital" && appointment.hospitalId === userId);

        if (!canManage) {
            throw new Error("Não tem permissão para alterar esta consulta.");
        }

        const bookingDate = data.bookingDate ?? appointment.booking_date.toISOString().slice(0, 10);
        const bookingHour = (data.bookingHour ?? appointment.booking_hour).substring(0, 5);
        const serviceId = data.serviceId ?? appointment.idService;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
            throw new Error("A data deve estar no formato YYYY-MM-DD.");
        }
        const parsedDate = new Date(`${bookingDate}T00:00:00.000Z`);
        if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== bookingDate) {
            throw new Error("A data seleccionada é inválida.");
        }
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(bookingHour)) {
            throw new Error("A hora deve estar no formato HH:mm.");
        }
        if (!serviceId) throw new Error("É necessário seleccionar um serviço.");

        // Gera a disponibilidade do dia solicitado antes da validação transaccional da remarcação.
        const availabilityService = new DoctorAvailabilityService();
        await availabilityService.generateAndList(appointment.idDoctor, bookingDate, bookingDate);

        await this.appointmentsRepository.updateWithSchedule(
            id,
            { serviceId, bookingDate, bookingHour }
        );
    }
}

export { UpdateAppointmentsServices };
