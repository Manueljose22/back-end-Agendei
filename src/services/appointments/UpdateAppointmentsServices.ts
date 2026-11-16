import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class UpdateAppointmentsServices {
    constructor(
        private appointmentsRepository: IAppointmentsRepository,
        private timetablesRepository: ITimetablesRepository
    ) {}

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

        const bookingDate = data.bookingDate ?? appointment.booking_date.toISOString().split("T")[0];
        const bookingHour = (data.bookingHour ?? appointment.booking_hour).substring(0, 5);
        const serviceId = data.serviceId ?? appointment.idService;

        const oldDate = appointment.booking_date.toISOString().split("T")[0];
        const oldAvailability = await this.timetablesRepository.getAvailabilityByDate(
            appointment.idDoctor,
            oldDate
        );
        const oldSlot = oldAvailability
            .flatMap((item) => item.timetables)
            .find((item) => item.hour.toISOString().split("T")[1].substring(0, 5) === appointment.booking_hour);

        if (!oldSlot) {
            throw new Error("Não foi possível localizar o horário actualmente reservado.");
        }

        const newAvailability = await this.timetablesRepository.getAvailabilityByDate(
            appointment.idDoctor,
            bookingDate
        );
        const availableDay = newAvailability.find((item) => !item.isBlocked);

        if (!availableDay) {
            throw new Error("O médico não possui disponibilidade para a nova data.");
        }

        const newSlot = availableDay.timetables.find((item) =>
            item.hour.toISOString().split("T")[1].substring(0, 5) === bookingHour &&
            (!item.isBooked || item.id === oldSlot.id)
        );

        if (!newSlot) {
            throw new Error("O novo horário não está disponível.");
        }

        await this.appointmentsRepository.updateWithBookedHour(
            id,
            { serviceId, bookingDate, bookingHour },
            oldSlot.id,
            newSlot.id
        );
    }
}

export { UpdateAppointmentsServices };
