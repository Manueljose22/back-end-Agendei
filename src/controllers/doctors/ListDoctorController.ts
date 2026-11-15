import { Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { ListDoctorsServices } from "../../services/doctors/ListDoctorsServices";

class ListDoctorController {
    async handle(request: Request, response: Response) {
        try {
            const isHospital = request.userRole === "hospital";
            const isAdmin = request.userRole === "platform_admin";
            const service = new ListDoctorsServices(new DoctorsRepository());
            const result = await service.execute(
                isHospital ? request.userId : undefined,
                isHospital || isAdmin
            );
            return response.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível listar os médicos.";
            return response.status(400).json({ message });
        }
    }
}

export default new ListDoctorController();
