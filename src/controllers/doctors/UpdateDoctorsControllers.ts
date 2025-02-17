import { Request, Response } from 'express';
import { DoctorsRepository } from '../../repositorys/doctors/DoctorsRepository';
import { doctorRequest } from '../../repositorys/doctors/IDoctorsRepository';
import { UpdateDoctorsServices } from '../../services/doctors/UpdateDoctorsServices';




class UpdateDoctorsControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;
        const data = request.body as doctorRequest;

        try {

            const doctorsRepository = new DoctorsRepository();
            const service = new UpdateDoctorsServices(doctorsRepository);

            const result = await service.execute(id, data);

            return response.json({message: 'Dados actualizados com sucesso.'});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdateDoctorsControllers;