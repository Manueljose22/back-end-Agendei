import { Request, Response } from 'express';
import { DeleteSpecialityByIdService } from '../../services/specialities/DeleteSpecialityByIdService';





class DeleteSpecialityByIdControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params

        try {
            const service = new DeleteSpecialityByIdService;
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteSpecialityByIdControllers;