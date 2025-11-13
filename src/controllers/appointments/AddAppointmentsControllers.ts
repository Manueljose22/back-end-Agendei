import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositories/appointments/AppointmentsRepository';
import { AddAppointmentsServices } from '../../services/appointments/AddAppointmentsServices';
import { TimetablesRepository } from '../../repositories/timetables/TimetablesRepository';




class AddAppointmentsControllers {

    async handle(request: Request, response: Response) {

        const { userId } = request;
        const { serviceId, doctorId, bookingDate, bookingHour } = request.body;
        

        try {

            const appointmentsRepository = new AppointmentsRepository();
            const timetablesRepository = new TimetablesRepository();
            const service = new AddAppointmentsServices(appointmentsRepository, timetablesRepository);

            const result = await service.execute({ patientId:userId, serviceId, doctorId, bookingDate, bookingHour })

            return response.status(200).json({message: 'Agendamento feito com sucesso.'});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddAppointmentsControllers;