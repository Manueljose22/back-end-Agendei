import { doctorSave, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";







class ListDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(): Promise<doctorSave[] | null> {
        
        const doctor = await this.IDoctorsRepository.findAll();
        
        return doctor;
    }
}

export { ListDoctorsServices };