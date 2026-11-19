import { AppError } from "../../errors/AppError";
import { hospitalInput, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class AddHospitalService {
    constructor(private IHospitalsRepository: IHospitalsRepository) {}

    async execute(data: hospitalInput, images: string[] = []): Promise<void> {
        const { name, address, email, phone, password, nif, role } = data;

        if (!name) {
            throw new AppError("Por favor, preencha o campo nome", 400);
        } else if (!email) {
            throw new AppError("Por favor, preencha o email", 400);
        } else if (!address) {
            throw new AppError("Por favor, preencha o campo endereço", 400);
        } else if (!phone) {
            throw new AppError("Por favor, preencha o campo número de telefone.", 400);
        } else if (!password) {
            throw new AppError("Senha é obrigatório.", 400);
        } else if (!nif) {
            throw new AppError("Por favor, preencha o campo nif.", 400);
        }

        const hospital = await this.IHospitalsRepository.findByName(name);

        if (hospital) {
            throw new AppError("Hospital já existe!", 409);
        }

        await this.IHospitalsRepository.create({
            name,
            address,
            email,
            phone,
            password,
            nif,
            role
        }, images);
    }
}

export { AddHospitalService };