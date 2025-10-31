import { ISpecialityRepository } from "../../repositories/specialities/ISpecialityRepository";






class DeleteSpecialityByIdService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(id: string): Promise<void> {

        const speciality = await this.ISpecialityRepository.findById(id);

        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }

        await this.ISpecialityRepository.delete(id);

    }
}

export { DeleteSpecialityByIdService };