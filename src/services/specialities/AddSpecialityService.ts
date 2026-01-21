import { ISpecialityRepository, specialityInput, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";



class AddSpecialityService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute({ name, hospitalId }: specialityInput): Promise<specialitySaved | Error> {

        const speciality = await this.ISpecialityRepository.findByName(name);
      
        if (speciality) {
            throw new Error("Especialidade já existe!")
        }

        if (!name) {
            throw new Error("Por favor, preencha o campo nome");
        } 


       const newSpeciality = await this.ISpecialityRepository.create({name, hospitalId});
       return newSpeciality
    }
}

export { AddSpecialityService };