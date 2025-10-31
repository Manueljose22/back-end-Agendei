import { Request, Response } from 'express';
import { PatientsRepository } from '../../repositories/patients/PatientsRepository';
import { UpdatePasswordPatientServices } from '../../services/patients/UpdatePasswordPatientServices';




class UpdatePasswordPatientControllers {
    async handle(request: Request, response: Response) {
        const { userId } = request;
        const { id } = request.params;
        const data = request.body;

        try {
            const patientsRepository = new PatientsRepository();
            const service = new UpdatePasswordPatientServices(patientsRepository);

            const result = await service.execute(id, userId, data);

            return response.json({ message: "Senha actualizada com sucesso." });

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdatePasswordPatientControllers;