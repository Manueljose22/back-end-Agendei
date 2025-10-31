import { Request, Response } from 'express';
import { uploadsFiles } from '../../middlewares/upload/uploadsFiles';
import { AddHospitalService } from '../../services/hospitals/AddHospitalService';




class AddHospitalControllers {
    async handle(request: Request, response: Response) {
        
        const data = request.body;
        const images = request.files as Express.Multer.File[]
        
        try {

            const urls = await uploadsFiles(images)
            const service = new AddHospitalService()
            const result = await service.execute(data, urls)

            return response.json({message: "Hospital cadastrado com sucesso."})

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddHospitalControllers;