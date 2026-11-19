import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from "../../repositories/appointments/AppointmentsRepository";
import { ListAppointmentByPatientsServices } from "../../services/appointments/ListAppointmentByPatientsServices";

class ListAppointmentByPatientsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const appointmentsRepository = new AppointmentsRepository();
            const service = new ListAppointmentByPatientsServices(appointmentsRepository);
            const result = await service.execute(request.userId);

            return response.status(200).json(result);
        } catch (error) {
            return next(error);
        }
    }
}

export default new ListAppointmentByPatientsControllers();
