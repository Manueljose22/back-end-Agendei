import { AppError } from "../../errors/AppError";
import { DoctorStatus } from "@prisma/client";
import { hash } from "bcrypt";
import { normalizeDoctorStatus } from "../../utils/doctorStatus";
import { doctorRequest, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

const parseOptionalNumber = (value: unknown, field: string, integer = true): number | null => {
    if (value === undefined || value === null || value === "") return null;

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0 || (integer && !Number.isInteger(parsed))) {
        throw new AppError(`O campo ${field} deve conter um número válido.`, 400);
    }

    return parsed;
};

class AddDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(data: doctorRequest): Promise<void> {
        if (!data.name?.trim()) throw new AppError("Preencha o campo nome!", 400);
        if (!data.specialtyId) throw new AppError("Preencha o campo especialidade!", 400);
        if (!data.hospitalId) throw new AppError("Hospital não identificado.", 400);

        data.status = normalizeDoctorStatus(data.status, DoctorStatus.ACTIVE);
        data.yaersOfExperience = parseOptionalNumber(data.yaersOfExperience, "anos de experiência");
        data.numberOfPatients = parseOptionalNumber(data.numberOfPatients, "número de pacientes");
        data.rating = parseOptionalNumber(data.rating, "classificação", false);

        if (data.password && data.password.length < 8) {
            throw new AppError("A senha do médico deve ter pelo menos 8 caracteres.", 400);
        }

        const duplicate = await this.doctorsRepository.findByName(data.name.trim(), data.hospitalId);
        if (duplicate) throw new AppError("Já existe um médico com este nome neste hospital.", 409);

        const specialtyBelongs = await this.doctorsRepository.specialtyBelongsToHospital(
            data.specialtyId,
            data.hospitalId
        );
        if (!specialtyBelongs) throw new AppError("A especialidade seleccionada não pertence a este hospital.", 400);

        data.name = data.name.trim();

        // O login compara hashes bcrypt; nunca persistir a senha em texto simples.
        if (data.password) {
            data.password = await hash(data.password, 12);
        }

        await this.doctorsRepository.save(data);
    }
}

export { AddDoctorsServices };
