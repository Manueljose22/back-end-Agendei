import { Request, Response } from 'express';
import { uploadsFiles } from '../../middlewares/upload/uploadsFiles';
import { AddHospitalService } from '../../services/hospitals/AddHospitalService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';




class AddHospitalControllers {
    async handle(request: Request, response: Response) {
        
        const data = request.body;
        // const images = request.files as Express.Multer.File[]
        
        try {

            // const urls = await uploadsFiles(images)
            const hospitalsRepository = new HospitalsRepository();
            const service = new AddHospitalService(hospitalsRepository)
            const result = await service.execute(data)

            return response.json({message: "Hospital cadastrado com sucesso."})

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddHospitalControllers;