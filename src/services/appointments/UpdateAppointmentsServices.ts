import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { appointmentsRequest, IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";

class UpdateAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute(
        id: string,
        data: Pick<appointmentsRequest, "bookingDate" | "bookingHour" | "serviceId">,
        userId: string,
        role: AccountRole
    ): Promise<void> {
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
            throw new Error("Não tem permissão para alterar esta consulta.");
        }

        await this.appointmentsRepository.update(id, data);
    }
}

export { UpdateAppointmentsServices };
