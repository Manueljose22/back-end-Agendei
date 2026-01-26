import { Request, Response } from 'express';
import { ServicesRepository } from '../../repositories/services/ServicesRepository';
import { GetAllServicesHospitalService } from '../../services/services/GetAllServicesHospitalService';




class GetAllServicesHospitalController {
    async handle(request: Request, response: Response) {
        const {userId} = request;
        
        try {

            const repository = new ServicesRepository();
            const service = new GetAllServicesHospitalService(repository);

            const result = await service.execute(userId)

            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetAllServicesHospitalController;