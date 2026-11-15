import { Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { GetDoctorsByHospitalsServices } from "../../services/doctors/GetDoctorsByHospitalsServices";

class GetDoctorsByHospitalsControllers {
    async handle(request: Request, response: Response) {
        try {
            const service = new GetDoctorsByHospitalsServices(new DoctorsRepository());
            const result = await service.execute(request.userId);
            return response.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível listar os médicos do hospital.";
            return response.status(400).json({ message });
        }
    }
}

export default new GetDoctorsByHospitalsControllers();
