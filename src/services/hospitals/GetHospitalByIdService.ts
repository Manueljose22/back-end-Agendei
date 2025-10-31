import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";




class GetHospitalByIdService {

    constructor(private IHospitalsRepository: IHospitalsRepository) {}


    async execute(id: string): Promise<hospitalSave | null> {

        const hospital = await this.IHospitalsRepository.findById(id);

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        return hospital;
    }
}

export { GetHospitalByIdService };