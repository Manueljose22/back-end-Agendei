import { Request, Response } from 'express';
import { AddPatientsServices } from '../../services/patients/AddPatientsServices';
import { PatientsRepository } from '../../repositories/patients/PatientsRepository';
import { patientsRequest } from '../../repositories/patients/IPatientsRepository';







class AddPatientsControllers {
    
    async handle(request: Request, response: Response) {
        
        const data = request.body as patientsRequest;
        
        try {

            const patientsRepository = new PatientsRepository();
            const service = new AddPatientsServices(patientsRepository);

            const result = await service.execute(data);

            return response.status(201).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddPatientsControllers;