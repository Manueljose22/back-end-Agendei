import { Request, Response } from 'express';
import { ListHospitalsService } from '../../services/hospitals/ListHospitalsService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';

class ListHospitalsControllers {
    async handle(request: Request, response: Response) {
        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new ListHospitalsService(hospitalsRepository);
            const result = await service.execute(request.hospitalId);

            return response.json(result);
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível listar os hospitais.";

            return response.status(400).json({ message });
        }
    }
}

export default new ListHospitalsControllers();
