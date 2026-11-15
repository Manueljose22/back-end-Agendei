import { IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class DeleteDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(actorHospitalId: string, id: string, isPlatformAdmin = false): Promise<void> {
        const doctor = await this.doctorsRepository.findById(id, undefined, true);
        if (!doctor) throw new Error("Médico não encontrado.");

        if (!doctor.hospitalId) throw new Error("Este médico não está associado a um hospital.");
        if (!isPlatformAdmin && doctor.hospitalId !== actorHospitalId) {
            throw new Error("Não tem permissão para eliminar este médico.");
        }

        await this.doctorsRepository.delete(doctor.hospitalId, id);
    }
}

export { DeleteDoctorsServices };
