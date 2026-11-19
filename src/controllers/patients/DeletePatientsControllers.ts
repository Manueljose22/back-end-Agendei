import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { DeletePatientsServices } from "../../services/patients/DeletePatientsServices";

class DeletePatientsControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        if (request.userRole === "patient" && request.userId !== id) {
            return next(new AppError("Paciente não encontrado.", 404));
        }

        try {
            const repository = new PatientsRepository();
            const service = new DeletePatientsServices(repository);
            await service.execute(id, request.userId, request.userRole === "platform_admin");

            return response.status(200).json({ message: "Registo eliminado com sucesso." });
        } catch (error: unknown) {
            return next(error);
        }
    }
}

export default new DeletePatientsControllers();
