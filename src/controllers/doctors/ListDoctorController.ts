import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { ListDoctorsServices } from "../../services/doctors/ListDoctorsServices";

class ListDoctorController {
    async handle(request: Request, response: Response, next: NextFunction) {
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
            return next(error);
        }
    }
}

export default new ListDoctorController();
