import { doctorRequest, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";





class AddDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(data: doctorRequest): Promise<void | Error> {

        const doctor = await this.IDoctorsRepository.findByName(data.name);
        
        
        if (doctor) {
            throw new Error('Já existe um registro com este nome!');
        }

        if (!data.name) {
            throw new Error('Preencha o campo nome!');
        } else if (!data.specialtyId) {
            throw new Error('Preencha o campo especialidade!');
        }


        await this.IDoctorsRepository.save(data);
    }
}

export { AddDoctorsServices };