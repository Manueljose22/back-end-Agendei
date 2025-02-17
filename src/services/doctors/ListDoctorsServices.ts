import { doctorSave, IDoctorsRepository } from "../../repositorys/doctors/IDoctorsRepository";







class ListDoctorsServices {

    constructor(private IDoctorsRepository: IDoctorsRepository) { }

    async execute(search: string): Promise<doctorSave[] | null> {
        
        const doctor = await this.IDoctorsRepository.findAll(search);
        
        return doctor;
    }
}

export { ListDoctorsServices };