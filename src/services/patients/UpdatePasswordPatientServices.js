"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordPatientServices = void 0;
const bcrypt_1 = require("bcrypt");
class UpdatePasswordPatientServices {
    IPatientRepository;
    constructor(IPatientRepository) {
        this.IPatientRepository = IPatientRepository;
    }
    async execute(id, userId, data) {
        const patient = await this.IPatientRepository.findById(id);
        const isMatch = await (0, bcrypt_1.compare)(data.password, patient?.password);
        if (!patient) {
            throw new Error("Usuário não existe");
        }
        else if (id !== userId) {
            throw new Error("Erro no servidor, por favor tente mais tarde.");
        }
        else if (!isMatch) {
            throw new Error("Senha actual incorreta");
        }
        const passHash = await (0, bcrypt_1.hash)(data.newPassword, 12);
        await this.IPatientRepository.updatePassword(id, passHash);
    }
}
exports.UpdatePasswordPatientServices = UpdatePasswordPatientServices;
