import { Request, Response } from "express";
import { ManageDoctorScheduleService } from "../../services/schedules/ManageDoctorScheduleService";

const service = new ManageDoctorScheduleService();

class DoctorScheduleController {
    async get(request: Request, response: Response) {
        try {
            const schedule = await service.get(request.params.doctorId);
            return response.json(schedule);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Não foi possível consultar a agenda.";
            return response.status(400).json({ message });
        }
    }

    async replaceRules(request: Request, response: Response) {
        try {
            const { rules, bookingWindowDays } = request.body;
            const schedule = await service.replaceRules(
                request.params.doctorId,
                { id: request.userId, role: request.userRole },
                rules,
                bookingWindowDays
            );
            return response.json({
                message: "Agenda semanal actualizada com sucesso.",
                schedule
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Não foi possível actualizar a agenda.";
            const status = message.includes("permissões") || message.includes("própria agenda") ||
                message.includes("pertence ao seu hospital") ? 403 : 400;
            return response.status(status).json({ message });
        }
    }
}

export default new DoctorScheduleController();
