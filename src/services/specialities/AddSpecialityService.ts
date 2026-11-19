import { AppError } from "../../errors/AppError";
import { ISpecialityRepository, specialityInput, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";



class AddSpecialityService {

    constructor(private ISpecialityRepository: ISpecialityRepository) { }

    async execute(data: specialityInput): Promise<specialitySaved | Error> {

        const speciality = await this.ISpecialityRepository.findByName(data.name);
      
        if (speciality) {
            throw new AppError("Especialidade já existe!", 409);
        }

        if (!data.name) {
            throw new AppError("Por favor, preencha o campo nome", 400);
        } 


       const newSpeciality = await this.ISpecialityRepository.create(data);
       return newSpeciality
    }
}

export { AddSpecialityService };