import { ISpecialityRepository, specialityInput } from "../../repositories/specialities/ISpecialityRepository";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";





class UpdateSpecialityService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(id: string, { name }: specialityInput): Promise<void> {

        const speciality = await this.ISpecialityRepository.findById(id);

        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }



        const newData: specialityInput = {
            name: name ?? speciality.name,
        }


        await this.ISpecialityRepository.update(id, { name })
    }
}

export { UpdateSpecialityService };