import { Request, Response } from 'express';
import { GetSpecialityByIdService } from '../../services/specialities/GetSpecialityByIdService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class GetSpecialityByHospitailsControllers{
    async handle(request: Request, response: Response) {

        const { userId } = request

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new GetSpecialityByIdService(specialityRepository);
            const result = await service.execute(userId);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetSpecialityByHospitailsControllers;