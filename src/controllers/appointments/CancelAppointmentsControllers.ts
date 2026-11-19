import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { CancelAppointmentsServices } from "../../services/appointments/CancelAppointmentsServices";

class CancelAppointmentsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        try {
            const appointmentsRepository = new AppointmentsRepository();
            const service = new CancelAppointmentsServices(appointmentsRepository);

            await service.execute(id, request.userId, request.userRole);

            return response.status(200).json({ message: "Consulta cancelada com sucesso." });
        } catch (error) {
            return next(error);
        }
    }
}

export default new CancelAppointmentsControllers();
