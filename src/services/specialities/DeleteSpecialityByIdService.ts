import { AppError } from "../../errors/AppError";
import { ISpecialityRepository } from "../../repositories/specialities/ISpecialityRepository";

class DeleteSpecialityByIdService {
    constructor(private specialityRepository: ISpecialityRepository) {}

    async execute(id: string, hospitalId: string): Promise<void> {
        const deleted = await this.specialityRepository.delete(id, hospitalId);
        if (!deleted) {
            throw new AppError("Especialidade não encontrada ou sem permissão para a eliminar.", 404);
        }
    }
}

export { DeleteSpecialityByIdService };
