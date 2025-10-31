import { ISpecialityRepository, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";





class ListSpecialitiesService {

    private ISpecialityRepository: ISpecialityRepository;

    constructor() {
        this.ISpecialityRepository = new SpecialityRepository()
    }

    async execute(): Promise<specialitySaved[] | null> {

        const listSpeciality = await this.ISpecialityRepository.findAll();

        if (!listSpeciality) {
            throw new Error("Não há Especialidade registrados.");
        }

        return listSpeciality;
    }
}

export { ListSpecialitiesService };