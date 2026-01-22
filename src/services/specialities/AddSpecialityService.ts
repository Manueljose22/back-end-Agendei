import { ISpecialityRepository, specialityInput, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";



class AddSpecialityService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(data: specialityInput): Promise<specialitySaved | Error> {

        const speciality = await this.ISpecialityRepository.findByName(data.name);
      
        if (speciality) {
            throw new Error("Especialidade já existe!")
        }

        if (!data.name) {
            throw new Error("Por favor, preencha o campo nome");
        } 


       const newSpeciality = await this.ISpecialityRepository.create(data);
       return newSpeciality
    }
}

export { AddSpecialityService };