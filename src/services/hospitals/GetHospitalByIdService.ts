import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";




class GetHospitalByIdService {

    private IHospitalsRepository: IHospitalsRepository;

    constructor() {
        this.IHospitalsRepository = new HospitalsRepository();
    }

    async execute(id: string): Promise<hospitalSave | null> {

        const hospital = await this.IHospitalsRepository.findById(id);

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        return hospital;
    }
}

export { GetHospitalByIdService };