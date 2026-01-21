import { ISpecialityRepository, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";






class GetSpecialityByHospitailsService {

   constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(id: string): Promise<specialitySaved[] | null> {

        const speciality = await this.ISpecialityRepository.findByHospitails(id);

        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }

        return speciality;
    }
}

export { GetSpecialityByHospitailsService };