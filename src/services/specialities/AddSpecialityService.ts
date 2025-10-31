import { ISpecialityRepository, specialityInput, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";



class AddSpecialityService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute({ name }: specialityInput): Promise<specialitySaved | Error> {

        const speciality = await this.ISpecialityRepository.findByName(name);
      
        if (speciality) {
            throw new Error("Especialidade já existe!")
        }

        if (!name) {
            throw new Error("Por favor, preencha o campo nome");
        } 


       const newSpeciality = await this.ISpecialityRepository.create({name})
       return newSpeciality
    }
}

export { AddSpecialityService };