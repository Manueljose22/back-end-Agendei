import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class CancelAppointmentsServices {
    constructor(
        private appointmentsRepository: IAppointmentsRepository,
        private timetablesRepository: ITimetablesRepository
    ) {}

    async execute(id: string, userId: string, role: AccountRole): Promise<void> {
        const appointment = await this.appointmentsRepository.findById(id);

        if (!appointment) {
            throw new Error("Consulta não encontrada.");
        }

        const canManage =
            role === "platform_admin" ||
            (role === "patient" && appointment.patientId === userId) ||
            (role === "doctor" && appointment.idDoctor === userId) ||
            (role === "hospital" && appointment.hospitalId === userId);

        if (!canManage) {
            throw new Error("Não tem permissão para cancelar esta consulta.");
        }

        if (appointment.status.toLowerCase() === "cancelado") {
            throw new Error("Esta consulta já se encontra cancelada.");
        }

        const date = appointment.booking_date.toISOString().split("T")[0];
        const availability = await this.timetablesRepository.getAvailabilityByDate(
            appointment.idDoctor,
            date
        );

        const timetable = availability
            .flatMap((item) => item.timetables)
            .find((item) =>
                item.hour.toISOString().split("T")[1].substring(0, 5) === appointment.booking_hour
            );

        if (!timetable) {
            throw new Error("Não foi possível localizar o horário reservado para esta consulta.");
        }

        // O cancelamento e a libertação do horário são confirmados em conjunto.
        await this.appointmentsRepository.cancelWithReleasedHour(id, timetable.id);
    }
}

export { CancelAppointmentsServices };
