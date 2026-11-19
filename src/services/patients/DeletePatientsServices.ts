import { AppError } from "../../errors/AppError";
import { IPatientsRepository } from "../../repositories/patients/IPatientsRepository";

class DeletePatientsServices {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute(id: string, actorId: string, isPlatformAdmin: boolean): Promise<void> {
        const patient = await this.patientsRepository.findById(id);

        if (!patient) {
            throw new AppError("Paciente não encontrado.", 404);
        }

        if (!isPlatformAdmin && patient.id !== actorId) {
            throw new AppError("Não tem permissão para eliminar este registo.", 403);
        }

        await this.patientsRepository.delete(id);
    }
}

export { DeletePatientsServices };
