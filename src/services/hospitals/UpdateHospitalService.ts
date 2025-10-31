import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { hospitalInput, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";




class UpdateHospitalService {

    private IHospitalsRepository: IHospitalsRepository;

    constructor() {
        this.IHospitalsRepository = new HospitalsRepository();
    }

    async execute(id: string, { address, email, name, phone }: hospitalInput, images: string | string[]): Promise<void> {

        const hospital = await this.IHospitalsRepository.findById(id);
        let urls;

        if (!hospital) {
            throw new Error("Hospital não existe.");
        }

        if (Array.isArray(images)) {
            urls = images.map((url) => {
                return {
                    urlImagem: url
                }
            })
        }

        const newData: hospitalInput = {
            name: name ?? hospital.name,
            address: address ?? hospital.address,
            email: email ?? hospital.email,
            phone: phone ??  hospital.phone
        }

        const newUrl = urls ?? hospital.images

        await this.IHospitalsRepository.update(id, newData, newUrl)
    }
}

export { UpdateHospitalService };