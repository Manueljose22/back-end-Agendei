import { IDoctorsRepository, UpdateDoctor } from "../../repositories/doctors/IDoctorsRepository";






class UpdateDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }


    async execute(hospitalId: string, id: string, data: UpdateDoctor): Promise<void | Error> {

        const doctor = await this.IDoctorsRepository.findById(id);

        if (doctor?.Hospital?.id !== hospitalId) {
            throw new Error('Não é possível concluír esta operação, por favor tente mais tarde.');
        }

        if (!doctor) {
            throw new Error('doctor inválido!');
        }

        const newData = {
            name: data.name ?? doctor.name,
            // photo: data.photo ?? doctor.photo,
            email: data.email ?? doctor.email,
            phone: data.phone ?? doctor.phone,
            bio: data.bio ?? doctor.bio,
            address: data.address ?? doctor.address,
            yaersOfExperience: data.yaersOfExperience ?? doctor.yaersOfExperience,
            numberOfPatients: data.numberOfPatients ?? doctor.numberOfPatients,
            rating: data.rating ?? doctor.rating,
            specialtyId: data.specialtyId ?? doctor.Specialty?.id,
            status: data.status ?? doctor.status,
            hospitalId: data.hospitalId ?? doctor.Hospital?.id
        }


        await this.IDoctorsRepository.update(id, newData)
    }
}

export { UpdateDoctorsServices };