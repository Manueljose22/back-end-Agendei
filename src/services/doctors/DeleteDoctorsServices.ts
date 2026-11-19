import { AppError } from "../../errors/AppError";
import { IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class DeleteDoctorsServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(actorHospitalId: string, id: string, isPlatformAdmin = false): Promise<void> {
        const doctor = await this.doctorsRepository.findById(id, undefined, true);
        if (!doctor) throw new AppError("Médico não encontrado.", 404);

        if (!doctor.hospitalId) throw new AppError("Este médico não está associado a um hospital.", 409);
        if (!isPlatformAdmin && doctor.hospitalId !== actorHospitalId) {
            throw new AppError("Não tem permissão para eliminar este médico.", 403);
        }

        await this.doctorsRepository.delete(doctor.hospitalId, id);
    }
}

export { DeleteDoctorsServices };
