import { Request, Response } from 'express';
import { GetHospitalByIdService } from '../../services/hospitals/GetHospitalByIdService';




class GetHospitalByIdControllers {
    async handle(request: Request, response: Response) {
        
        const {id} = request.params

        try {

            const service = new GetHospitalByIdService;
            const result = await service.execute(id);
            return response.json(result)

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetHospitalByIdControllers;