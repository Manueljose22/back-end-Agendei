import { IPatientsRepository } from "../../repositories/patients/IPatientsRepository";

class DeletePatientsServices {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute(id: string, actorId: string, isPlatformAdmin: boolean): Promise<void> {
        const patient = await this.patientsRepository.findById(id);

        if (!patient) {
            throw new Error("Paciente não encontrado.");
        }

        if (!isPlatformAdmin && patient.id !== actorId) {
            throw new Error("Não tem permissão para eliminar este registo.");
        }

        await this.patientsRepository.delete(id);
    }
}

export { DeletePatientsServices };
