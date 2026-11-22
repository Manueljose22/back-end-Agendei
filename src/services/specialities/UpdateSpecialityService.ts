import { AppError } from "../../errors/AppError";
import { ISpecialityRepository, specialityInput } from "../../repositories/specialities/ISpecialityRepository";

class UpdateSpecialityService {
    constructor(private specialityRepository: ISpecialityRepository) {}

    async execute(id: string, hospitalId: string, data: Partial<Omit<specialityInput, "hospitalId">>): Promise<void> {
        const speciality = await this.specialityRepository.findById(id, hospitalId);

        if (!speciality) {
            throw new AppError("Especialidade não encontrada.", 404);
        }

        const updated = await this.specialityRepository.update(id, {
            name: data.name?.trim() || speciality.name,
            description: data.description ?? speciality.description,
            color: data.color ?? speciality.color
        }, hospitalId);

        if (!updated) {
            throw new AppError("Especialidade não encontrada ou sem permissão para a alterar.", 404);
        }
    }
}

export { UpdateSpecialityService };
