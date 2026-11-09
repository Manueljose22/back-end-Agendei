"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDoctorsByHospitalsServices = void 0;
class GetDoctorsByHospitalsServices {
    IDoctorsRepository;
    constructor(IDoctorsRepository) {
        this.IDoctorsRepository = IDoctorsRepository;
    }
    async execute(idHospital) {
        const doctor = await this.IDoctorsRepository.findAllByHospital(idHospital);
        if (!doctor) {
            throw new Error('Não há douctores cadastrados!');
        }
        return doctor;
    }
}
exports.GetDoctorsByHospitalsServices = GetDoctorsByHospitalsServices;
