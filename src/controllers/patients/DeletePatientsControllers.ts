import { Request, Response } from "express";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { DeletePatientsServices } from "../../services/patients/DeletePatientsServices";

class DeletePatientsControllers {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        if (request.userRole === "patient" && request.userId !== id) {
            return response.status(404).json({ message: "Paciente não encontrado." });
        }

        try {
            const repository = new PatientsRepository();
            const service = new DeletePatientsServices(repository);
            await service.execute(id, request.userId, request.userRole === "platform_admin");

            return response.status(200).json({ message: "Registo eliminado com sucesso." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível eliminar o paciente.";
            const status = message.includes("permissão") ? 403 : 400;
            return response.status(status).json({ message });
        }
    }
}

export default new DeletePatientsControllers();
