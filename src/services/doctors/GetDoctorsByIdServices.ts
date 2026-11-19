import { AppError } from "../../errors/AppError";
import { doctorSave, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";

class GetDoctorsByIdServices {
    constructor(private doctorsRepository: IDoctorsRepository) {}

    async execute(id: string, hospitalId?: string, includeSuspended = false): Promise<doctorSave> {
        const doctor = await this.doctorsRepository.findById(id, hospitalId, includeSuspended);
        if (!doctor) throw new AppError("Médico não encontrado ou sem permissão para consultar este registo.", 404);
        return doctor;
    }
}

export { GetDoctorsByIdServices };
