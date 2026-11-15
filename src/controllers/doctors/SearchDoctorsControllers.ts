import { Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { SearchDoctorsServices } from "../../services/doctors/SearchDoctorsServices";

class SearchDoctorsControllers {
    async handle(request: Request, response: Response) {
        const { q } = request.query;
        if (typeof q !== "string") {
            return response.status(400).json({ message: "O parâmetro 'q' deve ser uma string." });
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
            const message = error instanceof Error ? error.message : "Não foi possível pesquisar médicos.";
            return response.status(400).json({ message });
        }
    }
}

export default new SearchDoctorsControllers();
