import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositories/appointments/AppointmentsRepository';
import { CreateAppointmentsServices } from '../../services/appointments/CreateAppointmentsServices';




class CreateAppointmentsControllers {

    async handle(request: Request, response: Response) {

        const { serviceId, doctorId, bookingDate, bookingHour, clientId } = request.body;
        

        try {

            const appointmentsRepository = new AppointmentsRepository();
            const service = new CreateAppointmentsServices(appointmentsRepository);

            // const result = await service.execute({ userId: clientId, serviceId, doctorId, bookingDate, bookingHour })

            return response.status(200).json({message: 'Agendamento feito com sucesso.'});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new CreateAppointmentsControllers;