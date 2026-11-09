"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePatientsServices = void 0;
class DeletePatientsServices {
    IPatientsRepository;
    constructor(IPatientsRepository) {
        this.IPatientsRepository = IPatientsRepository;
    }
    async execute(id) {
        const user = await this.IPatientsRepository.findById(id);
        if (!user) {
            throw new Error('Não existe este usuário.');
        }
        await this.IPatientsRepository.delete(id);
    }
}
exports.DeletePatientsServices = DeletePatientsServices;
