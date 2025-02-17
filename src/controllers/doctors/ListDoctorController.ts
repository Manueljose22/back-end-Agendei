import { Request, Response } from 'express';
import { DoctorsRepository } from '../../repositorys/doctors/DoctorsRepository';
import { ListDoctorsServices } from '../../services/doctors/ListDoctorsServices';




class ListDoctorController {

    async handle(request: Request, response: Response) {
        
        const { search } = request.query;

        try {

            const doctorsRepository = new DoctorsRepository();
            const service = new ListDoctorsServices(doctorsRepository);

            const result = await service.execute(search as string);

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListDoctorController;