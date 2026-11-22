import { AppError } from "../../errors/AppError";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { IAppointmentsRepository } from "../../repositories/appointments/IAppointmentsRepository";
import { RescheduleProposalsRepository } from "../../repositories/appointments/RescheduleProposalsRepository";
import { DoctorAvailabilityService } from "../schedules/DoctorAvailabilityService";

export class CreateRescheduleProposalService {
    constructor(
        private appointmentsRepository: IAppointmentsRepository,
        private proposalsRepository: RescheduleProposalsRepository
    ) {}

    async execute(
        appointmentId: string,
        input: { proposedDate: string; proposedHour: string; reason?: string },
        userId: string,
        role: AccountRole
    ): Promise<{ id: string }> {
        if (role !== "doctor" && role !== "hospital") {
            throw new AppError("Apenas o médico ou o hospital pode propor um reagendamento.", 403);
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input.proposedDate)) {
            throw new AppError("A data deve estar no formato YYYY-MM-DD.", 400);
        }
        const parsedDate = new Date(`${input.proposedDate}T00:00:00.000Z`);
        if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== input.proposedDate) {
            throw new AppError("A data proposta é inválida.", 400);
        }
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.proposedHour)) {
            throw new AppError("A hora deve estar no formato HH:mm.", 400);
        }
        if (input.reason !== undefined && (typeof input.reason !== "string" || input.reason.length > 500)) {
            throw new AppError("O motivo deve ser um texto com até 500 caracteres.", 400);
        }

        const appointment = await this.appointmentsRepository.findById(appointmentId);
        if (!appointment) throw new AppError("Consulta não encontrada.", 404);
        const authorized = role === "doctor"
            ? appointment.idDoctor === userId
            : appointment.hospitalId === userId;
        if (!authorized) throw new AppError("Não tem permissão para propor o reagendamento desta consulta.", 403);
        if (appointment.status.toLowerCase() === "cancelado") {
            throw new AppError("Não é possível reagendar uma consulta cancelada.", 409);
        }

        const availability = new DoctorAvailabilityService();
        await availability.generateAndList(appointment.idDoctor, input.proposedDate, input.proposedDate);

        return this.proposalsRepository.create({
            appointmentId,
            proposedById: userId,
            proposedByRole: role,
            proposedDate: input.proposedDate,
            proposedHour: input.proposedHour,
            reason: input.reason
        });
    }
}
