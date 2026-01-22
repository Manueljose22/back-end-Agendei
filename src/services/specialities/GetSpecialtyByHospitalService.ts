import { ISpecialityRepository, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";






class GetSpecialtyByHospitalService {

   constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(id: string): Promise<specialitySaved[] | null> {

        const speciality = await this.ISpecialityRepository.findByHospitails(id);
        
        
        if (!speciality) {
            throw new Error("Nenhum especialidade foi registrada.");
        }

        return speciality;
    }
}

export { GetSpecialtyByHospitalService };