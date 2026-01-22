import { Request, Response } from 'express';
import { DoctorsRepository } from '../../repositories/doctors/DoctorsRepository';
import { GetDoctorsByIdServices } from '../../services/doctors/GetDoctorsByIdServices';
import { GetDoctorsByHospitalsServices } from '../../services/doctors/GetDoctorsByHospitalsServices';




class GetDoctorsByHospitalsControllers {

    async handle(request: Request, response: Response) {

        const { userId } = request;

        try {

            const doctorsRepository = new DoctorsRepository();
            const service = new GetDoctorsByHospitalsServices(doctorsRepository);

            const result = await service.execute(userId)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetDoctorsByHospitalsControllers;