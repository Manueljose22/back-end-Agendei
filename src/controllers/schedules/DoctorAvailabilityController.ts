import { Request, Response } from "express";
import { DoctorAvailabilityService } from "../../services/schedules/DoctorAvailabilityService";

const service = new DoctorAvailabilityService();

class DoctorAvailabilityController {
    async list(request: Request, response: Response) {
        try {
            const result = await service.generateAndList(request.params.doctorId, request.query.from as string, request.query.to as string);
            return response.json(result);
        } catch (error) {
            return response.status(400).json({ message: error instanceof Error ? error.message : "Não foi possível gerar disponibilidades." });
        }
    }

    async addException(request: Request, response: Response) {
        try {
            const exception = await service.addException(request.params.doctorId,
                { id: request.userId, role: request.userRole }, request.body);
            return response.status(201).json({ message: "Excepção registada com sucesso.", exception });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Não foi possível registar a excepção.";
            const forbidden = message.includes("permissões") || message.includes("própria agenda") || message.includes("pertence ao seu hospital");
            return response.status(forbidden ? 403 : 400).json({ message });
        }
    }

    async removeException(request: Request, response: Response) {
        try {
            await service.removeException(request.params.doctorId, request.params.exceptionId,
                { id: request.userId, role: request.userRole });
            return response.json({ message: "Excepção removida com sucesso." });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Não foi possível remover a excepção.";
            const forbidden = message.includes("permissões") || message.includes("própria agenda") || message.includes("pertence ao seu hospital");
            return response.status(forbidden ? 403 : 400).json({ message });
        }
    }
}

export default new DoctorAvailabilityController();
