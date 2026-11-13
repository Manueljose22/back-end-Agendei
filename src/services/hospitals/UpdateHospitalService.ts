import { hospitalUpdate, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class UpdateHospitalService {
    constructor(private IHospitalsRepository: IHospitalsRepository) {}

    async execute(
        id: string,
        { address, email, name, phone }: hospitalUpdate,
        images?: string[]
    ): Promise<string[]> {
        const hospital = await this.IHospitalsRepository.findById(id);

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        const newData: hospitalUpdate = {
            name: name ?? hospital.name,
            address: address ?? hospital.address,
            email: email ?? hospital.email,
            phone: phone ?? hospital.phone
        };

        return await this.IHospitalsRepository.update(id, newData, images);
    }
}

export { UpdateHospitalService };