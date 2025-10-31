import { ISpecialityRepository } from "../../repositories/specialities/ISpecialityRepository";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";





class DeleteSpecialityByIdService {

    private ISpecialityRepository: ISpecialityRepository;

    constructor() {
        this.ISpecialityRepository = new SpecialityRepository()
    }

    async execute(id: string): Promise<void> {

        const speciality = await this.ISpecialityRepository.findById(id);

        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }

        await this.ISpecialityRepository.delete(id);

    }
}

export { DeleteSpecialityByIdService };