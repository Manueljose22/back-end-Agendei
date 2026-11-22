import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { ConfirmAppointmentService } from "../../services/appointments/ConfirmAppointmentService";

class ConfirmAppointmentController {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const service = new ConfirmAppointmentService(new AppointmentsRepository());
            await service.execute(request.params.id, request.userId, request.userRole);
            return response.status(200).json({ message: "Consulta confirmada com sucesso." });
        } catch (error) {
            return next(error);
        }
    }
}

export default new ConfirmAppointmentController();
