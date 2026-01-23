import { Request, Response } from 'express';
import { DoctorsRepository } from '../../repositories/doctors/DoctorsRepository';
import { DeleteDoctorsServices } from '../../services/doctors/DeleteDoctorsServices';




class DeleteDoctorsControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const {userId} = request;

        try {

            const doctorsRepository = new DoctorsRepository();
            const service = new DeleteDoctorsServices(doctorsRepository);

            const result = await service.execute(userId, id);

            return response.status(200).json({ message: 'Registro excluído com sucesso.' })

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteDoctorsControllers;