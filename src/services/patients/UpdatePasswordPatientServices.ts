import { compare, hash } from "bcrypt";
import { IPatientsRepository } from "../../repositories/patients/IPatientsRepository";

class UpdatePasswordPatientServices {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute(
        id: string,
        userId: string,
        data: { password: string; newPassword: string }
    ): Promise<void> {
        if (id !== userId) {
            throw new Error("Não tem permissão para alterar esta senha.");
        }

        if (!data?.password || !data?.newPassword || data.newPassword.length < 8) {
            throw new Error("Informe a senha actual e uma nova senha com pelo menos 8 caracteres.");
        }

        const patient = await this.patientsRepository.findById(id);
        if (!patient || !patient.password) {
            throw new Error("Paciente não encontrado ou sem senha definida.");
        }

        const isMatch = await compare(data.password, patient.password);
        if (!isMatch) {
            throw new Error("Senha actual incorrecta.");
        }

        const passwordHash = await hash(data.newPassword, 12);
        await this.patientsRepository.updatePassword(id, passwordHash);
    }
}

export { UpdatePasswordPatientServices };
