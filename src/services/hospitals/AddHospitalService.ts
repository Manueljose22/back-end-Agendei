import { hospitalInput, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";



class AddHospitalService {


    constructor(private IHospitalsRepository: IHospitalsRepository) {}

    async execute({ name, address, email, phone, password, nif, role }: hospitalInput): Promise<void | Error> {

        const hospital = await this.IHospitalsRepository.findByName(name);
        // let urls;

        if (hospital) {
            throw new Error("Hospital já existe!")
        }

        if (!name) {
            throw new Error("Por favor, preencha o campo nome");
        }  else if (!email) {
            throw new Error("Por favor, preencha o email");
        }else if (!address) {
            throw new Error("Por favor, preencha o campo endereço");
        } else if (!phone) {
            throw new Error("Por favor, preencha o campo número de telefone.");
        }  else if (!password) {
            throw new Error("Senha é obrigatório..");
        }  else if (!nif) {
            throw new Error("Por favor, preencha o campo nif.");
        }

        // if (Array.isArray(images)) {
        //     urls = images.map((url) => {
        //         return {
        //             urlImagem: url
        //         }
        //     })
        // }


        await this.IHospitalsRepository.create({ name, address, email, phone, password, nif, role})
    }
}

export { AddHospitalService };