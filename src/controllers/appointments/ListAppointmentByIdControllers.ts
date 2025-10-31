import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositories/appointments/AppointmentsRepository';
import { ListAppointmentByIdServices } from '../../services/appointments/ListAppointmentByIdServices';




class ListAppointmentByIdControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const appointmentsRepository = new AppointmentsRepository();
            const service = new ListAppointmentByIdServices(appointmentsRepository);

            const result = await service.execute(id);

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListAppointmentByIdControllers;