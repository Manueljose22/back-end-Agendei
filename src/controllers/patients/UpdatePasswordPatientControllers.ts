import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { UpdatePasswordPatientServices } from "../../services/patients/UpdatePasswordPatientServices";

class UpdatePasswordPatientControllers {
    async handle(request: Request, response: Response, next: NextFunction) {
        const { id } = request.params;

        try {
            const repository = new PatientsRepository();
            const service = new UpdatePasswordPatientServices(repository);
            await service.execute(id, request.userId, request.body);

            return response.status(200).json({ message: "Senha actualizada com sucesso." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível actualizar a senha.";
            return next(error);
        }
    }
}

export default new UpdatePasswordPatientControllers();
