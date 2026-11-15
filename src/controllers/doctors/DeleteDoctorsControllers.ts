import { Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { DeleteDoctorsServices } from "../../services/doctors/DeleteDoctorsServices";

class DeleteDoctorsControllers {
    async handle(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const service = new DeleteDoctorsServices(new DoctorsRepository());
            await service.execute(request.userId, id, request.userRole === "platform_admin");
            return response.status(200).json({ message: "Registo eliminado com sucesso." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Não foi possível eliminar o médico.";
            return response.status(400).json({ message });
        }
    }
}

export default new DeleteDoctorsControllers();
