import { AppError } from "../../errors/AppError";
import { hospitalInput, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";

class AddHospitalService {
    constructor(private hospitalsRepository: IHospitalsRepository) {}

    async execute(data: hospitalInput, images: string[] = []): Promise<void> {
        const { name, address, email, phone, password, nif } = data;

        if (!name?.trim()) {
            throw new AppError("Por favor, preencha o campo nome", 400);
        } else if (!email?.trim()) {
            throw new AppError("Por favor, preencha o email", 400);
        } else if (!address?.trim()) {
            throw new AppError("Por favor, preencha o campo endereço", 400);
        } else if (!phone?.trim()) {
            throw new AppError("Por favor, preencha o campo número de telefone.", 400);
        } else if (!password || password.length < 8) {
            throw new AppError("A senha deve ter pelo menos 8 caracteres.", 400);
        } else if (!nif?.trim()) {
            throw new AppError("Por favor, preencha o campo nif.", 400);
        }

        const hospital = await this.hospitalsRepository.findByName(name.trim());
        if (hospital) {
            throw new AppError("Hospital já existe!", 409);
        }

        // O papel inicial é definido pelo servidor; nunca confiar no valor enviado pelo cliente.
        await this.hospitalsRepository.create({
            name: name.trim(),
            address: address.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password,
            nif: nif.trim(),
            role: "admin"
        }, images);
    }
}

export { AddHospitalService };
