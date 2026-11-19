import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { GetDoctorsByIdServices } from "../../services/doctors/GetDoctorsByIdServices";

class GetDoctorsByIdControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
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
            if (request.userRole === "doctor" && !isOwnDoctorProfile && result.status !== "ACTIVE") {
                return next(new AppError("Médico não encontrado.", 404));
            }
            return response.status(200).json(result);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new GetDoctorsByIdControllers();
