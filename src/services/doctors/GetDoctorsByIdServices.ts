import { doctorSave, IDoctorsRepository } from "../../repositorys/doctors/IDoctorsRepository";







class GetDoctorsByIdServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(id: string): Promise<doctorSave | null> {

        const doctor = await this.IDoctorsRepository.findById(id);

        if (!doctor) {
            throw new Error('Não existe este douctor!');
        }

        return doctor;
    }
}

export { GetDoctorsByIdServices };