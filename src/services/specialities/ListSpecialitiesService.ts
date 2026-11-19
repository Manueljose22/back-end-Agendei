import { AppError } from "../../errors/AppError";
import { ISpecialityRepository, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";





class ListSpecialitiesService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(): Promise<specialitySaved[] | null> {

        const listSpeciality = await this.ISpecialityRepository.findAll();

        if (!listSpeciality) {
            throw new AppError("Não há Especialidade registrados.", 404);
        }

        return listSpeciality;
    }
}

export { ListSpecialitiesService };