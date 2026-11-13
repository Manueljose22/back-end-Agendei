import { Request, Response } from 'express';
import { GetHospitalByIdService } from '../../services/hospitals/GetHospitalByIdService';
import { HospitalsRepository } from '../../repositories/hospitals/HospitalsRepository';

class GetHospitalByIdControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const hospitalsRepository = new HospitalsRepository();
            const service = new GetHospitalByIdService(hospitalsRepository);
            const canViewSuspended = request.isPlatformAdmin === true || request.hospitalId === id;
            const result = await service.execute(id, canViewSuspended);

            return response.json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível consultar o hospital.";
            return response.status(404).json({ message });
        }
    }
}

export default new GetHospitalByIdControllers();
