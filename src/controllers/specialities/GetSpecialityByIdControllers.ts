import { Request, Response } from 'express';
import { GetSpecialityByIdService } from '../../services/specialities/GetSpecialityByIdService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class GetSpecialityByIdControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new GetSpecialityByIdService(specialityRepository);
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetSpecialityByIdControllers;