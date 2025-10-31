import { Request, Response } from 'express';
import { DeleteSpecialityByIdService } from '../../services/specialities/DeleteSpecialityByIdService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class DeleteSpecialityByIdControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new DeleteSpecialityByIdService(specialityRepository);
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteSpecialityByIdControllers;