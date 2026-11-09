"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPatientsServices = void 0;
class SearchPatientsServices {
    patientsRepository;
    constructor(patientsRepository) {
        this.patientsRepository = patientsRepository;
    }
    async execute(query) {
        const patients = await this.patientsRepository.findSearch(query);
        return patients;
    }
}
exports.SearchPatientsServices = SearchPatientsServices;
