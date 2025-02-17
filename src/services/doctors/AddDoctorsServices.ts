import { doctorRequest, IDoctorsRepository } from "../../repositorys/doctors/IDoctorsRepository";





class AddDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute({ name, especialty, photo }: doctorRequest): Promise<void | Error> {

        const doctor = await this.IDoctorsRepository.findByName(name);
        
        
        if (doctor) {
            throw new Error('Já existe um registro com este nome!');
        }

        if (!name) {
            throw new Error('Preencha o campo nome!');
        } else if (!especialty) {
            throw new Error('Preencha o campo especialidade!');
        }


        await this.IDoctorsRepository.save({ name, especialty, photo });
    }
}

export { AddDoctorsServices };