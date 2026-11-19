import { AppError } from "../../errors/AppError";
import { ISpecialityRepository, specialityInput } from "../../repositories/specialities/ISpecialityRepository";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";





class UpdateSpecialityService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(id: string, data: specialityInput): Promise<void> {

        const speciality = await this.ISpecialityRepository.findById(id);

        if (!speciality) {
            throw new AppError("Especialidade não existe.", 404);
        }



        const newData = {
            name: data.name ?? speciality.name,
            description: data.description ?? speciality.description,
            color: data.color ??  speciality.color
        }


        await this.ISpecialityRepository.update(id, newData)
    }
}

export { UpdateSpecialityService };