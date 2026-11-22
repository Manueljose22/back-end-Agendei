import { AppError } from "../../errors/AppError";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { RescheduleProposalsRepository } from "../../repositories/appointments/RescheduleProposalsRepository";
import { DoctorAvailabilityService } from "../schedules/DoctorAvailabilityService";
import { prismaClient } from "../../config/prisma/prismaClient";

export class RespondToRescheduleProposalService {
    constructor(private proposalsRepository: RescheduleProposalsRepository) {}

    async execute(
        proposalId: string,
        decision: "accept" | "reject",
        userId: string,
        role: AccountRole
    ): Promise<void> {
        if (role !== "patient") {
            throw new AppError("Apenas o paciente pode responder à proposta de reagendamento.", 403);
        }
        const proposal = await prismaClient.rescheduleProposal.findUnique({
            where: { id: proposalId },
            select: {
                appointment: { select: { patientId: true, doctorId: true } },
                proposedDate: true
            }
        });
        if (!proposal) throw new AppError("Proposta de reagendamento não encontrada.", 404);
        if (proposal.appointment.patientId !== userId) {
            throw new AppError("Não tem permissão para responder a esta proposta.", 403);
        }

        if (decision === "accept") {
            const date = proposal.proposedDate.toISOString().slice(0, 10);
            const availability = new DoctorAvailabilityService();
            await availability.generateAndList(proposal.appointment.doctorId, date, date);
        }
        await this.proposalsRepository.respond({ proposalId, patientId: userId, decision });
    }
}
