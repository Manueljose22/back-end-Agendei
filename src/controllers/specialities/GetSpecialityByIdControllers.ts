import { NextFunction, Request, Response } from 'express';
import { GetSpecialityByIdService } from '../../services/specialities/GetSpecialityByIdService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class GetSpecialityByIdControllers {
    async handle(request: Request, response: Response, next: NextFunction) {

        const { id } = request.params

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new GetSpecialityByIdService(specialityRepository);
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetSpecialityByIdControllers;