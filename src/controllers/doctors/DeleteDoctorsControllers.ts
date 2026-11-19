import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { DeleteDoctorsServices } from "../../services/doctors/DeleteDoctorsServices";

class DeleteDoctorsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        try {
            const { id } = request.params;
            const service = new DeleteDoctorsServices(new DoctorsRepository());
            await service.execute(request.userId, id, request.userRole === "platform_admin");
            return response.status(200).json({ message: "Registo eliminado com sucesso." });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new DeleteDoctorsControllers();
