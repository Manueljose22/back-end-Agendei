import { Request, Response } from 'express';
import { ListSpecialitiesService } from '../../services/specialities/ListSpecialitiesService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class ListSpecialityControllers {
    async handle(request: Request, response: Response) {

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new ListSpecialitiesService(specialityRepository);
            const result = await service.execute();
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListSpecialityControllers;