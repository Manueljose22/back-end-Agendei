"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDoctorsServices = void 0;
class SearchDoctorsServices {
    doctorsRepository;
    constructor(doctorsRepository) {
        this.doctorsRepository = doctorsRepository;
    }
    async execute(query) {
        const doctors = await this.doctorsRepository.findSearch(query);
        return doctors;
    }
}
exports.SearchDoctorsServices = SearchDoctorsServices;
