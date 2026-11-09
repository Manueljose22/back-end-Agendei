"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePatientsServices = void 0;
class ProfilePatientsServices {
    IPatientsRepository;
    constructor(IPatientsRepository) {
        this.IPatientsRepository = IPatientsRepository;
    }
    async execute(id) {
        const patient = await this.IPatientsRepository.findById(id);
        if (!patient) {
            throw new Error("Erro no servidor, por favor tente mais tarde!");
        }
        return patient;
    }
}
exports.ProfilePatientsServices = ProfilePatientsServices;
