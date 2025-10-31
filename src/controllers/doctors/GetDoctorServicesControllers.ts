import { Request, Response } from 'express';
import { DoctorsRepository } from '../../repositories/doctors/DoctorsRepository';
import { GetDoctorServicesServices } from '../../services/doctors/GetDoctorServicesServices';




class GetDoctorServicesControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const doctorsRepository = new DoctorsRepository();
            const service = new GetDoctorServicesServices(doctorsRepository);

            const result = await service.execute(id);

            return response.status(200).json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetDoctorServicesControllers;