import { IDoctorsRepository, UpdateDoctor} from "../../repositories/doctors/IDoctorsRepository";






class UpdateDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }


    async execute(id: string, {name, specialtyId, photo}: UpdateDoctor): Promise<void | Error> {

        const doctor = await this.IDoctorsRepository.findById(id);

        if (!doctor) {
            throw new Error('doctor inválido!');
        }

        const data = {
            name: name ?? doctor.name,
            especialty: specialtyId ?? doctor.Specialty?.id,
            photo: photo ?? doctor.photo
        }
        

        await this.IDoctorsRepository.update(id, data)
    }
}

export { UpdateDoctorsServices };