import { Request, Response } from 'express';
import { ListHospitalsService } from '../../services/hospitals/ListHospitalsService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';




class ListHospitalsControllers {
    async handle(request: Request, response: Response) {

        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new ListHospitalsService(hospitalsRepository);
            const result = await service.execute();
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListHospitalsControllers;