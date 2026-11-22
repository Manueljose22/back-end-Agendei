import { AppError } from "../../errors/AppError";
import { ISpecialityRepository, specialityInput, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";

class AddSpecialityService {
    constructor(private specialityRepository: ISpecialityRepository) {}

    async execute(data: specialityInput): Promise<specialitySaved | Error> {
        const name = data.name?.trim();
        if (!name) {
            throw new AppError("Por favor, preencha o campo nome.", 400);
        }

        const speciality = await this.specialityRepository.findByName(name);
        if (speciality) {
            throw new AppError("Especialidade já existe!", 409);
        }

        return this.specialityRepository.create({ ...data, name });
    }
}

export { AddSpecialityService };
