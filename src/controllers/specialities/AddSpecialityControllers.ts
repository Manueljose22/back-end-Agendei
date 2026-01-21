import { Request, Response } from 'express';
import { AddSpecialityService } from '../../services/specialities/AddSpecialityService';
import { SpecialityRepository } from '../../repositories/specialities/SpecialityRepository';





class AddSpecialityControllers {
    async handle(request: Request, response: Response) {

        const data = request.body;
        const {userId} = request;
        
        data.hospitalId = userId;

        try {
            const specialityRepository = new SpecialityRepository()
            const service = new AddSpecialityService(specialityRepository);
            const result = await service.execute(data)

            return response.status(201).json({ message: "Especialidade cadastrada com sucesso." })

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddSpecialityControllers;