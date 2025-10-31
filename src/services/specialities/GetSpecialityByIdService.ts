import { ISpecialityRepository, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";





class GetSpecialityByIdService {

    private ISpecialityRepository: ISpecialityRepository;

    constructor() {
        this.ISpecialityRepository = new SpecialityRepository()
    }


    async execute(id: string): Promise<specialitySaved | null> {

        const speciality = await this.ISpecialityRepository.findById(id);

        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }

        return speciality;
    }
}

export { GetSpecialityByIdService };