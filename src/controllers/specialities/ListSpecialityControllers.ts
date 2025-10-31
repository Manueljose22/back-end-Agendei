import { Request, Response } from 'express';
import { ListSpecialitiesService } from '../../services/specialities/ListSpecialitiesService';





class ListSpecialityControllers {
    async handle(request: Request, response: Response) {

        try {

            const service = new ListSpecialitiesService();
            const result = await service.execute();
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListSpecialityControllers;