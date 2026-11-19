import { AppError } from "../../errors/AppError";
import { ISpecialityRepository, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";






class GetSpecialityByIdService {

   constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(id: string): Promise<specialitySaved | null> {

        const speciality = await this.ISpecialityRepository.findById(id);

        if (!speciality) {
            throw new AppError("Especialidade não existe.", 404);
        }

        return speciality;
    }
}

export { GetSpecialityByIdService };