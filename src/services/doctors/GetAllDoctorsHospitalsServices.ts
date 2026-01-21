import { doctorSave, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";







class GetAllDoctorsHospitalsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(idHospital: string): Promise<doctorSave[] | null> {

        const doctor = await this.IDoctorsRepository.findAllByHospital(idHospital);

        if (!doctor) {
            throw new Error('Não existe douctores!');
        }

        return doctor;
    }
}

export { GetAllDoctorsHospitalsServices };