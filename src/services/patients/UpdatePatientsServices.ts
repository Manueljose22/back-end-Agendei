import { AppError } from "../../errors/AppError";
import {
    IPatientsRepository,
    patientsProfileUpdate
} from "../../repositories/patients/IPatientsRepository";

class UpdatePatientsServices {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute(
        id: string,
        actorId: string,
        isPlatformAdmin: boolean,
        data: patientsProfileUpdate
    ): Promise<{ previousPhoto: string | null }> {
        const patient = await this.patientsRepository.findById(id);

        if (!patient) {
            throw new AppError("Paciente não encontrado.", 404);
        }

        if (!isPlatformAdmin && patient.id !== actorId) {
            throw new AppError("Não tem permissão para alterar este perfil.", 403);
        }

        if (data.email && data.email !== patient.email) {
            const existingPatient = await this.patientsRepository.findByEmail(data.email);
            if (existingPatient && existingPatient.id !== id) {
                throw new AppError("Já existe um paciente registado com este email.", 409);
            }
        }

        await this.patientsRepository.update(id, {
            name: data.name ?? patient.name,
            email: data.email ?? patient.email,
            phone: data.phone ?? patient.phone,
            dateBirth: data.dateBirth ?? patient.dateBirth,
            address: data.address ?? patient.address,
            gender: data.gender ?? patient.gender,
            photo: data.photo ?? patient.photo
        });

        return { previousPhoto: patient.photo };
    }
}

export { UpdatePatientsServices };
