import { Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { GetDoctorServicesServices } from "../../services/doctors/GetDoctorServicesServices";

class GetDoctorServicesControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const repository = new DoctorsRepository();

        try {
            const isHospital = request.userRole === "hospital";
            const isAdmin = request.userRole === "platform_admin";
            const isOwnDoctorProfile = request.userRole === "doctor" && request.userId === id;
            const doctor = await repository.findById(
                id,
                isHospital ? request.userId : undefined,
                isHospital || isAdmin || isOwnDoctorProfile
            );

            if (!doctor) return response.status(404).json({ message: "Médico não encontrado ou sem permissão." });
            if (request.userRole === "doctor" && !isOwnDoctorProfile && doctor.status !== "ACTIVE") {
                return response.status(404).json({ message: "Médico não encontrado." });
            }

            const service = new GetDoctorServicesServices(repository);
            const result = await service.execute(id);
            return response.status(200).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível consultar os serviços do médico.";
            return response.status(400).json({ message });
        }
    }
}

export default new GetDoctorServicesControllers();
