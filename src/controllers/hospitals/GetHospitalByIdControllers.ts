import { Request, Response } from 'express';
import { GetHospitalByIdService } from '../../services/hospitals/GetHospitalByIdService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';




class GetHospitalByIdControllers {
    async handle(request: Request, response: Response) {
        
        const {id} = request.params

        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new GetHospitalByIdService(hospitalsRepository);
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetHospitalByIdControllers;