import { NextFunction, Request, Response } from "express";
import { ManageDoctorScheduleService } from "../../services/schedules/ManageDoctorScheduleService";

const service = new ManageDoctorScheduleService();

class DoctorScheduleController {
    async get(request: Request, response: Response, next: NextFunction) {
        try {
            const schedule = await service.get(request.params.doctorId);
            return response.json(schedule);
        } catch (error) {
            return next(error);
        }
    }

    async replaceRules(request: Request, response: Response, next: NextFunction) {
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
            return next(error);
        }
    }
}

export default new DoctorScheduleController();
