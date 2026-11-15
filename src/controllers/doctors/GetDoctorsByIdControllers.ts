import { Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { GetDoctorsByIdServices } from "../../services/doctors/GetDoctorsByIdServices";

class GetDoctorsByIdControllers {
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const isHospital = request.userRole === "hospital";
            const isAdmin = request.userRole === "platform_admin";
            const isOwnDoctorProfile = request.userRole === "doctor" && request.userId === id;
            const service = new GetDoctorsByIdServices(new DoctorsRepository());
            const result = await service.execute(
                id,
                isHospital ? request.userId : undefined,
                isHospital || isAdmin || isOwnDoctorProfile
            );
            if (request.userRole === "doctor" && !isOwnDoctorProfile && result.status !== "activo") {
                return response.status(404).json({ message: "Médico não encontrado." });
            }
            return response.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível consultar o médico.";
            return response.status(404).json({ message });
        }
    }
}

export default new GetDoctorsByIdControllers();
