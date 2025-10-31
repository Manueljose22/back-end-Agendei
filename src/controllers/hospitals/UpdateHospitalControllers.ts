import { Request, Response } from 'express';
import { uploadsFiles } from '../../middlewares/upload/uploadsFiles';
import { UpdateHospitalService } from '../../services/hospitals/UpdateHospitalService';




class UpdateHospitalControllers {
    async handle(request: Request, response: Response) {

        const { id } = request.params;
        const data = request.body;
        const images = request.files as Express.Multer.File[];

        try {
            const urls = await uploadsFiles(images);
            const service = new UpdateHospitalService();
            const result = await service.execute(id, data, urls);

            return response.json({message: "Dados actualizados com sucesso."});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdateHospitalControllers;