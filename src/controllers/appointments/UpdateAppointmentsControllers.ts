import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositories/appointments/AppointmentsRepository';
import { UpdateAppointmentsServices } from '../../services/appointments/UpdateAppointmentsServices';
import { TimetablesRepository } from '../../repositories/timetables/TimetablesRepository';




class UpdateAppointmentsControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params;
        const { bookingDate, bookingHour, serviceId } = request.body;

        try {
            const appointmentsRepository = new AppointmentsRepository();
            const service = new UpdateAppointmentsServices(appointmentsRepository);

            const result = await service.execute(id, { bookingDate, bookingHour, serviceId });

            return response.status(200).json({ message: 'Agendamento actualizado com sucesso..' });


        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdateAppointmentsControllers;