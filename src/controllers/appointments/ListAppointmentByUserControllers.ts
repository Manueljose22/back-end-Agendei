import { Request, Response } from 'express';
import { AppointmentsRepository } from '../../repositorys/appointments/AppointmentsRepository';
import { ListAppointmentByUserServices } from '../../services/appointments/ListAppointmentByUserServices';




class ListAppointmentByUserControllers {
    
    async handle(request: Request, response: Response) {
        
        const {userId} = request;
        
        try {

            const appointmentsRepository = new AppointmentsRepository();
            const service = new ListAppointmentByUserServices(appointmentsRepository);

            const result = await service.execute(userId);

            return response.status(200).json(result);
            
        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListAppointmentByUserControllers;