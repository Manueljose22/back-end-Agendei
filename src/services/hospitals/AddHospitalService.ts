import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { hospitalInput, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";



class AddHospitalService {

    private IHospitalsRepository: IHospitalsRepository;

    constructor() {
        this.IHospitalsRepository = new HospitalsRepository()
    }

    async execute({ name, address, email, phone }: hospitalInput, images: string[] | string): Promise<void | Error> {

        const hospital = await this.IHospitalsRepository.findByName(name);
        let urls;

        if (hospital) {
            throw new Error("Hospital já existe!")
        }

        if (!name) {
            throw new Error("Por favor, preencha o campo nome");
        } else if (!address) {
            throw new Error("Por favor, preencha o campo endereço");
        } else if (!phone) {
            throw new Error("Por favor, preencha o campo número de telefone.");
        }

        if (Array.isArray(images)) {
            urls = images.map((url) => {
                return {
                    urlImagem: url
                }
            })
        }


        await this.IHospitalsRepository.create({ name, address, email, phone }, urls)
    }
}

export { AddHospitalService };