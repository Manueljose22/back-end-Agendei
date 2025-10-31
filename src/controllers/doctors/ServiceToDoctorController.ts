import { Request, Response } from 'express';
import { ServiceToDoctorServices } from '../../services/doctors/ServiceToDoctorServices';
import { DoctorsRepository } from '../../repositories/doctors/DoctorsRepository';





class ServiceToDoctorController {
    async handle(request: Request, response: Response) {
        const { serviceId, doctorId, price } = request.body;
        
        try {
            
            const doctorsRepository = new DoctorsRepository()
            const service = new ServiceToDoctorServices(doctorsRepository);
            await service.execute({ serviceId, doctorId, price });
            
            return response.status(200).json({message: 'Serviço vinculado ao médico com sucesso!'});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ServiceToDoctorController;