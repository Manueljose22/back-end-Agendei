"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPatientsByIdServices = void 0;
class GetPatientsByIdServices {
    IPatientsRepository;
    constructor(IPatientsRepository) {
        this.IPatientsRepository = IPatientsRepository;
    }
    async execute(id) {
        const client = await this.IPatientsRepository.findById(id);
        if (!client) {
            throw new Error('Paciente não existe!');
        }
        return client;
    }
}
exports.GetPatientsByIdServices = GetPatientsByIdServices;
