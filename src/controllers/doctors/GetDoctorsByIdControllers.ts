import { Request, Response } from 'express';
import { DoctorsRepository } from '../../repositorys/doctors/DoctorsRepository';
import { GetDoctorsByIdServices } from '../../services/doctors/GetDoctorsByIdServices';




class GetDoctorsByIdControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const doctorsRepository = new DoctorsRepository();
            const service = new GetDoctorsByIdServices(doctorsRepository);

            const result = await service.execute(id)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetDoctorsByIdControllers;