import { AppError } from "../../errors/AppError";
import { IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";

export class ConfirmAppointmentService {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

    async execute(id: string, userId: string, role: AccountRole): Promise<void> {
        if (role === "patient") {
            throw new AppError("O paciente não pode confirmar o próprio agendamento.", 403);
        }

        const appointment = await this.appointmentsRepository.findById(id);
        if (!appointment) throw new AppError("Consulta não encontrada.", 404);

        const canConfirm =
            role === "platform_admin" ||
            (role === "doctor" && appointment.idDoctor === userId) ||
            (role === "hospital" && appointment.hospitalId === userId);

        if (!canConfirm) throw new AppError("Não tem permissão para confirmar esta consulta.", 403);
        await this.appointmentsRepository.confirm(id);
    }
}
