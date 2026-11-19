import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { GetDoctorServicesServices } from "../../services/doctors/GetDoctorServicesServices";

class GetDoctorServicesControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
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

            if (!doctor) return next(new AppError("Médico não encontrado ou sem permissão.", 404));
            if (request.userRole === "doctor" && !isOwnDoctorProfile && doctor.status !== "ACTIVE") {
                return next(new AppError("Médico não encontrado.", 404));
            }

            const service = new GetDoctorServicesServices(repository);
            const result = await service.execute(id);
            return response.status(200).json(result);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetDoctorServicesControllers();
