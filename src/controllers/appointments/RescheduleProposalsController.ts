import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { RescheduleProposalsRepository } from "../../repositories/appointments/RescheduleProposalsRepository";
import { CreateRescheduleProposalService } from "../../services/appointments/CreateRescheduleProposalService";
import { RespondToRescheduleProposalService } from "../../services/appointments/RespondToRescheduleProposalService";

class RescheduleProposalsController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new CreateRescheduleProposalService(
                new AppointmentsRepository(),
                new RescheduleProposalsRepository()
            );
            const proposal = await service.execute(
                request.params.id,
                request.body,
                request.userId,
                request.userRole
            );
            return response.status(201).json({
                message: "Proposta de reagendamento enviada com sucesso.",
                proposal
            });
        } catch (error) {
            return next(error);
        }
    }

    async respond(request: Request, response: Response, next: NextFunction) {
        try {
            const decision = request.body?.decision;
            if (decision !== "accept" && decision !== "reject") {
                return response.status(400).json({ message: "A decisão deve ser 'accept' ou 'reject'." });
            }
            const service = new RespondToRescheduleProposalService(new RescheduleProposalsRepository());
            await service.execute(request.params.id, decision, request.userId, request.userRole);
            return response.status(200).json({
                message: decision === "accept"
                    ? "Proposta aceite. A consulta foi reagendada com sucesso."
                    : "Proposta recusada com sucesso."
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default new RescheduleProposalsController();
