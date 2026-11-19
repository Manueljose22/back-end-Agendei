import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { ListAppointmentsServices } from "../../services/appointments/ListAppointmentsServices";

class ListAppointmentsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { search } = request.query;

        try {
            const repository = new AppointmentsRepository();
            const service = new ListAppointmentsServices(repository);
            const result = await service.execute(search as string, {
                userId: request.userId,
                role: request.userRole
            });

            return response.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    }
}

export default new ListAppointmentsControllers();
