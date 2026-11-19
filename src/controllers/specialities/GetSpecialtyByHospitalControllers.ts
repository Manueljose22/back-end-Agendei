import { NextFunction, Request, Response } from 'express';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';
import { GetSpecialtyByHospitalService } from '../../services/specialities/GetSpecialtyByHospitalService';





class GetSpecialtyByHospitalControllers{
    async handle(request: Request, response: Response, next: NextFunction) {

        const { userId } = request

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new GetSpecialtyByHospitalService(specialityRepository);
            const result = await service.execute(userId);
            return response.json(result)

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetSpecialtyByHospitalControllers;