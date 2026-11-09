"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDoctorsServices = void 0;
class ListDoctorsServices {
    IDoctorsRepository;
    constructor(IDoctorsRepository) {
        this.IDoctorsRepository = IDoctorsRepository;
    }
    async execute() {
        const doctor = await this.IDoctorsRepository.findAll();
        return doctor;
    }
}
exports.ListDoctorsServices = ListDoctorsServices;
