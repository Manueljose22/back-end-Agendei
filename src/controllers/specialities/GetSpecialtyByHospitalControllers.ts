import { Request, Response } from 'express';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';
import { GetSpecialtyByHospitalService } from '../../services/specialities/GetSpecialtyByHospitalService';





class GetSpecialtyByHospitalControllers{
    async handle(request: Request, response: Response) {

        const { userId } = request

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new GetSpecialtyByHospitalService(specialityRepository);
            const result = await service.execute(userId);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetSpecialtyByHospitalControllers;