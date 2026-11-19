import { NextFunction, Request, Response } from "express";
import { DoctorAvailabilityService } from "../../services/schedules/DoctorAvailabilityService";

const service = new DoctorAvailabilityService();

class DoctorAvailabilityController {
    async list(request: Request, response: Response, next: NextFunction) {
        try {
            const result = await service.generateAndList(request.params.doctorId, request.query.from as string, request.query.to as string);
            return response.json(result);
        } catch (error) {
            return next(error);
        }
    }

    async addException(request: Request, response: Response, next: NextFunction) {
        try {
            const exception = await service.addException(request.params.doctorId,
                { id: request.userId, role: request.userRole }, request.body);
            return response.status(201).json({ message: "Excepção registada com sucesso.", exception });
        } catch (error) {
            return next(error);
        }
    }

    async removeException(request: Request, response: Response, next: NextFunction) {
        try {
            await service.removeException(request.params.doctorId, request.params.exceptionId,
                { id: request.userId, role: request.userRole });
            return response.json({ message: "Excepção removida com sucesso." });
        } catch (error) {
            return next(error);
        }
    }
}

export default new DoctorAvailabilityController();
