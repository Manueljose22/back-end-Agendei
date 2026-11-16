import { Request, Response } from "express";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { UpdatePasswordPatientServices } from "../../services/patients/UpdatePasswordPatientServices";

class UpdatePasswordPatientControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const repository = new PatientsRepository();
            const service = new UpdatePasswordPatientServices(repository);
            await service.execute(id, request.userId, request.body);

            return response.status(200).json({ message: "Senha actualizada com sucesso." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível actualizar a senha.";
            const status = message.includes("permissão") ? 403 : 400;
            return response.status(status).json({ message });
        }
    }
}

export default new UpdatePasswordPatientControllers();
