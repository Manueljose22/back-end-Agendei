import { Request, Response } from 'express';
import { patientsRequest } from '../../repositories/patients/IPatientsRepository';
import { PatientsRepository } from '../../repositories/patients/PatientsRepository';
import { UpdatePatientsServices } from '../../services/patients/UpdatePatientsServices';
import { uploadsFiles } from '../../middlewares/upload/uploadsFiles';






class UpdatePatientsControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;
        const data = request.body as patientsRequest;
        console.log(data);
        const image = request.file as Express.Multer.File;
        
        

        try {

            data.photo = await uploadsFiles(image) as string;

            const patientsRepository = new PatientsRepository();
            const service = new UpdatePatientsServices(patientsRepository);

            const result = await service.execute(id, data);

            return response.json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdatePatientsControllers;