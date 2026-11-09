"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPatientsServices = void 0;
class ListPatientsServices {
    IPatientsRepository;
    constructor(IPatientsRepository) {
        this.IPatientsRepository = IPatientsRepository;
    }
    async execute(search) {
        const patients = await this.IPatientsRepository.findAll(search);
        return patients;
    }
}
exports.ListPatientsServices = ListPatientsServices;
