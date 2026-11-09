"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDoctorsByIdServices = void 0;
class GetDoctorsByIdServices {
    IDoctorsRepository;
    constructor(IDoctorsRepository) {
        this.IDoctorsRepository = IDoctorsRepository;
    }
    async execute(id) {
        const doctor = await this.IDoctorsRepository.findById(id);
        if (!doctor) {
            throw new Error('Não existe este douctor!');
        }
        return doctor;
    }
}
exports.GetDoctorsByIdServices = GetDoctorsByIdServices;
