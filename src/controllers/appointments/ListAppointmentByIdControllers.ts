import { NextFunction, Request, Response } from "express";
import { AppointmentsRepository } from '../../repositories/appointments/AppointmentsRepository';
import { ListAppointmentByIdServices } from '../../services/appointments/ListAppointmentByIdServices';




class ListAppointmentByIdControllers {

    async handle(request: Request, response: Response, next: NextFunction) {

        const { id } = request.params;

        try {

            const appointmentsRepository = new AppointmentsRepository();
            const service = new ListAppointmentByIdServices(appointmentsRepository);

            const result = await service.execute(id);

            return response.status(200).json(result);

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new ListAppointmentByIdControllers;