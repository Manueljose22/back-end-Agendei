import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositorys/appointments/AppointmentsRepository';
import { DeleteAppointmentsServices } from '../../services/appointments/DeleteAppointmentsServices';




class DeleteAppointmentsControllers {
    async handle(request: Request, response: Response) {

        const { userId } = request;
        const { id } = request.params

        try {
            const appointmentsRepository = new AppointmentsRepository();
            const service = new DeleteAppointmentsServices(appointmentsRepository);

            const result = await service.execute(id, userId);

            return response.status(200).json({message: 'Agendamento cancelado com sucesso.'});


        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteAppointmentsControllers;