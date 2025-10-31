import { Request, Response } from 'express';
import { PatientsRepository } from '../../repositories/patients/PatientsRepository';
import { DeletePatientsServices } from '../../services/patients/DeletePatientsServices';






class DeletePatientsControllers {
    async handle(request: Request, response: Response) {
        
        const { id } = request.params;

        try {

            const patientsRepository = new PatientsRepository();
            const service = new DeletePatientsServices(patientsRepository);

            const result = await service.execute(id);

            return response.status(200).json({ message: 'Registro excluído com sucesso.' })

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeletePatientsControllers;