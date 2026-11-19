import { AppError } from "../../errors/AppError";
import { DoctorStatus } from "@prisma/client";
import { normalizeDoctorStatus } from "../../utils/doctorStatus";
import { doctorRequest, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class AddDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(data: doctorRequest): Promise<void> {
        if (!data.name?.trim()) throw new AppError("Preencha o campo nome!", 400);
        if (!data.specialtyId) throw new AppError("Preencha o campo especialidade!", 400);
        if (!data.hospitalId) throw new AppError("Hospital não identificado.", 400);

        data.status = normalizeDoctorStatus(data.status, DoctorStatus.ACTIVE);

        const duplicate = await this.doctorsRepository.findByName(data.name.trim(), data.hospitalId);
        if (duplicate) throw new AppError("Já existe um médico com este nome neste hospital.", 409);

        const specialtyBelongs = await this.doctorsRepository.specialtyBelongsToHospital(
            data.specialtyId,
            data.hospitalId
        );
        if (!specialtyBelongs) throw new AppError("A especialidade seleccionada não pertence a este hospital.", 400);

        data.name = data.name.trim();
        await this.doctorsRepository.save(data);
    }
}

export { AddDoctorsServices };
