import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositories/appointments/AppointmentsRepository';
import { ListAppointmentByPatientsServices } from '../../services/appointments/ListAppointmentByPatientsServices';




class ListAppointmentByPatientsControllers {
    
    async handle(request: Request, response: Response) {
        
        const {userId} = request;
        
        try {

            const appointmentsRepository = new AppointmentsRepository();
            const service = new ListAppointmentByPatientsServices(appointmentsRepository);

            const result = await service.execute(userId);

            return response.status(200).json(result);
            
        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListAppointmentByPatientsControllers;