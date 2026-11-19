import { AppError } from "../../errors/AppError";
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
            throw new AppError("Não tem permissão para alterar esta senha.", 403);
        }

        if (!data?.password || !data?.newPassword || data.newPassword.length < 8) {
            throw new AppError("Informe a senha actual e uma nova senha com pelo menos 8 caracteres.", 400);
        }

        const patient = await this.patientsRepository.findById(id);
        if (!patient || !patient.password) {
            throw new AppError("Paciente não encontrado ou sem senha definida.", 404);
        }

        const isMatch = await compare(data.password, patient.password);
        if (!isMatch) {
            throw new AppError("Senha actual incorrecta.", 400);
        }

        const passwordHash = await hash(data.newPassword, 12);
        await this.patientsRepository.updatePassword(id, passwordHash);
    }
}

export { UpdatePasswordPatientServices };
