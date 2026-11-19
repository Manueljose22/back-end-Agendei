import { AppError } from "../../errors/AppError";
import { ISpecialityRepository } from "../../repositories/specialities/ISpecialityRepository";






class DeleteSpecialityByIdService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(id: string): Promise<void> {

        const speciality = await this.ISpecialityRepository.findById(id);

        if (!speciality) {
            throw new AppError("Especialidade não existe.", 404);
        }

        await this.ISpecialityRepository.delete(id);

    }
}

export { DeleteSpecialityByIdService };