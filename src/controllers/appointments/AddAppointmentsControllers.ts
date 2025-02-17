import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositorys/appointments/AppointmentsRepository';
import { AddAppointmentsServices } from '../../services/appointments/AddAppointmentsServices';




class AddAppointmentsControllers {

    async handle(request: Request, response: Response) {

        const { userId } = request;
        const { serviceId, doctorId, bookingDate, bookingHour } = request.body;
        

        try {

            const appointmentsRepository = new AppointmentsRepository();
            const service = new AddAppointmentsServices(appointmentsRepository);

            const result = await service.execute({ userId, serviceId, doctorId, bookingDate, bookingHour })

            return response.status(200).json({message: 'Agendamento feito com sucesso.'});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddAppointmentsControllers;