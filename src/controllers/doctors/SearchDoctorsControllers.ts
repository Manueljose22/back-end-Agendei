import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { SearchDoctorsServices } from "../../services/doctors/SearchDoctorsServices";

class SearchDoctorsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { q } = request.query;
        if (typeof q !== "string") {
            return next(new AppError("O parâmetro 'q' deve ser uma string.", 400));
        }

        try {
            const isHospital = request.userRole === "hospital";
            const isAdmin = request.userRole === "platform_admin";
            const service = new SearchDoctorsServices(new DoctorsRepository());
            const doctors = await service.execute(
                q,
                isHospital ? request.userId : undefined,
                isHospital || isAdmin
            );
            return response.status(200).json(doctors);
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new SearchDoctorsControllers();
