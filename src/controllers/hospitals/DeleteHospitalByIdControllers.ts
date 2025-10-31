import { Request, Response } from 'express';
import { DeleteHospitalByIdService } from '../../services/hospitals/DeleteHospitalByIdService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';




class DeleteHospitalByIdControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params

        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new DeleteHospitalByIdService(hospitalsRepository);
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteHospitalByIdControllers;