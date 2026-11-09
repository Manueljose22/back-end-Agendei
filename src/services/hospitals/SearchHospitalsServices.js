"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHospitalsServices = void 0;
class SearchHospitalsServices {
    hospitalsRepository;
    constructor(hospitalsRepository) {
        this.hospitalsRepository = hospitalsRepository;
    }
    async execute(query) {
        const hospitals = await this.hospitalsRepository.findSearch(query);
        return hospitals;
    }
}
exports.SearchHospitalsServices = SearchHospitalsServices;
