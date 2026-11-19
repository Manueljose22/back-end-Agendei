import { NextFunction, Request, Response } from 'express';
import { DeleteSpecialityByIdService } from '../../services/specialities/DeleteSpecialityByIdService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class DeleteSpecialityByIdControllers {
    async handle(request: Request, response: Response, next: NextFunction) {

        const { id } = request.params

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new DeleteSpecialityByIdService(specialityRepository);
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new DeleteSpecialityByIdControllers;