import { AppError } from "../../errors/AppError";
import { IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class DeleteHospitalByIdService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(id: string, actorId: string, isPlatformAdmin: boolean): Promise<string[]> {
        if (!isPlatformAdmin && id !== actorId) {
            throw new AppError("Não tem permissão para eliminar este hospital.", 403);
        }

        const hospital = await this.hospitalsRepository.findById(id);
        if (!hospital) {
            throw new AppError("Hospital não existe.", 404);
        }

        return this.hospitalsRepository.delete(id);
    }
}

export { DeleteHospitalByIdService };
