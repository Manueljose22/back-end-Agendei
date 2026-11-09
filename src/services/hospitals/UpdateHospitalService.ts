import { hospitalUpdate, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class UpdateHospitalService {
    constructor(private IHospitalsRepository: IHospitalsRepository) {}

    async execute(id: string, { address, email, name, phone }: hospitalUpdate, images: string | string[]): Promise<void> {
        const hospital = await this.IHospitalsRepository.findById(id);
        let urls;

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        if (Array.isArray(images)) {
            urls = images.map((url) => ({
                urlImagem: url
            }));
        }

        const newData: hospitalUpdate = {
            name: name ?? hospital.name,
            address: address ?? hospital.address,
            email: email ?? hospital.email,
            phone: phone ?? hospital.phone
        };

        const newUrl = urls ?? hospital.images;

        await this.IHospitalsRepository.update(id, newData, newUrl);
    }
}

export { UpdateHospitalService };