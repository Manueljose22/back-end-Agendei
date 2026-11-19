import { AppError } from "../../errors/AppError";
import { IPatientsRepository, patientsSave } from "../../repositories/patients/IPatientsRepository";

class ProfilePatientsServices {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute(id: string): Promise<patientsSave> {
        const patient = await this.patientsRepository.findById(id);

        if (!patient) {
            throw new AppError("Paciente não encontrado.", 404);
        }

        return patient;
    }
}

export { ProfilePatientsServices };
