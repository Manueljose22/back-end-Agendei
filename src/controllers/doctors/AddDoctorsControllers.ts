import { Request, Response } from 'express';
import { doctorRequest } from '../../repositories/doctors/IDoctorsRepository';
import { DoctorsRepository } from '../../repositories/doctors/DoctorsRepository';
import { AddDoctorsServices } from '../../services/doctors/AddDoctorsServices';
import { uploadsFiles } from '../../middlewares/upload/uploadsFiles';




class AddDoctorsControllers {
    
    async handle(request: Request, response: Response) {
        
        const data = request.body as doctorRequest;
        
        if (request.file) {
            data.photo = await uploadsFiles(request.file) as string;
        }

        try {

            const doctorRepository = new DoctorsRepository();
            const service = new AddDoctorsServices(doctorRepository);

            const result = await service.execute(data);

            return response.status(201).json({message: 'Douctor cadastrado com sucesso! '});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddDoctorsControllers;