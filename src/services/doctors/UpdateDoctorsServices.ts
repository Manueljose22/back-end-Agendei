import { IDoctorsRepository, doctorRequest } from "../../repositorys/doctors/IDoctorsRepository";






class UpdateDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }


    async execute(id: string, {name, especialty, photo}: doctorRequest): Promise<void | Error> {

        const doctor = await this.IDoctorsRepository.findById(id);

        if (!doctor) {
            throw new Error('doctor inválido!');
        }

        const data = {
            name: name ?? doctor.name,
            especialty: especialty ?? doctor.especialty,
            photo: photo ?? doctor.photo
        }
        

        await this.IDoctorsRepository.update(id, data)
    }
}

export { UpdateDoctorsServices };