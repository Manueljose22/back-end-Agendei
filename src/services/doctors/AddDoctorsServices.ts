import { DoctorStatus } from "@prisma/client";
import { normalizeDoctorStatus } from "../../utils/doctorStatus";
import { doctorRequest, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class AddDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(data: doctorRequest): Promise<void> {
        if (!data.name?.trim()) throw new Error("Preencha o campo nome!");
        if (!data.specialtyId) throw new Error("Preencha o campo especialidade!");
        if (!data.hospitalId) throw new Error("Hospital não identificado.");

        data.status = normalizeDoctorStatus(data.status, DoctorStatus.ACTIVE);

        const duplicate = await this.doctorsRepository.findByName(data.name.trim(), data.hospitalId);
        if (duplicate) throw new Error("Já existe um médico com este nome neste hospital.");

        const specialtyBelongs = await this.doctorsRepository.specialtyBelongsToHospital(
            data.specialtyId,
            data.hospitalId
        );
        if (!specialtyBelongs) throw new Error("A especialidade seleccionada não pertence a este hospital.");

        data.name = data.name.trim();
        await this.doctorsRepository.save(data);
    }
}

export { AddDoctorsServices };
