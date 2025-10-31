import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";




class DeleteHospitalByIdService {

    private IHospitalsRepository: IHospitalsRepository;

    constructor() {
        this.IHospitalsRepository = new HospitalsRepository();
    }

    async execute(id: string): Promise<void> {

        const hospital = await this.IHospitalsRepository.findById(id);
        
        if (!hospital) {
            throw new Error("Hospital não existe.");
        }
        
        await this.IHospitalsRepository.delete(id);

    }
}

export { DeleteHospitalByIdService };