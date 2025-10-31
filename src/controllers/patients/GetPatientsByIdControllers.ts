import { Request, Response } from 'express';
import { GetPatientsByIdServices } from '../../services/patients/GetPatientsByIdServices';
import { PatientsRepository } from '../../repositories/patients/PatientsRepository';






class GetPatientsByIdControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const patientsRepository = new PatientsRepository();
            const service = new GetPatientsByIdServices(patientsRepository);

            const result = await service.execute(id)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetPatientsByIdControllers;