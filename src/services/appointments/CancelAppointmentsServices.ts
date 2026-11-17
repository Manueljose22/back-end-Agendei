import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";

class CancelAppointmentsServices {
    constructor(private appointmentsRepository: IAppointmentsRepository) {}

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

        // O cancelamento apenas altera o estado; a disponibilidade é calculada
        // pela agenda e pelas consultas activas, sem libertar slots legados.
        await this.appointmentsRepository.cancel(id);
    }
}

export { CancelAppointmentsServices };
