import { Request, Response } from 'express';
import { UpdateSpecialityService } from '../../services/specialities/UpdateSpecialityService';





class UpdateSpecialityControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params;
        const data = request.body;

        try {

            const service = new UpdateSpecialityService();
            const result = await service.execute(id, data);

            return response.json({ message: "Dados actualizados com sucesso." });

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdateSpecialityControllers;