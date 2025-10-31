import { Request, Response } from 'express';
import { ListPatientsServices } from '../../services/patients/ListPatientsServices';
import { PatientsRepository } from '../../repositories/patients/PatientsRepository';






class ListPatientsController {

    async handle(request: Request, response: Response) {

        const { search } = request.query;

        try {

            const patientsRepository = new PatientsRepository();
            const service = new ListPatientsServices(patientsRepository);

            const result = await service.execute(search as string);

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListPatientsController;