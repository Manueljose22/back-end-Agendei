import { AppError } from "../../errors/AppError";
import { hospitalUpdate, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class UpdateHospitalService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(
        id: string,
        actorId: string,
        isPlatformAdmin: boolean,
        { address, email, name, phone }: hospitalUpdate,
        images?: string[]
    ): Promise<string[]> {
        if (!isPlatformAdmin && id !== actorId) {
            throw new AppError("Não tem permissão para alterar os dados deste hospital.", 403);
        }

        const hospital = await this.hospitalsRepository.findById(id);
        if (!hospital) {
            throw new AppError("Hospital não existe.", 404);
        }

        const newData: hospitalUpdate = {
            name: name ?? hospital.name,
            address: address ?? hospital.address,
            email: email ?? hospital.email,
            phone: phone ?? hospital.phone
        };

        return this.hospitalsRepository.update(id, newData, images);
    }
}

export { UpdateHospitalService };
