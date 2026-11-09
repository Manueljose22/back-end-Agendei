"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDoctorServicesServices = void 0;
class GetDoctorServicesServices {
    IDoctorsRepository;
    constructor(IDoctorsRepository) {
        this.IDoctorsRepository = IDoctorsRepository;
    }
    async execute(id) {
        const doctor_Service = await this.IDoctorsRepository.findDoctorService(id);
        return doctor_Service;
    }
}
exports.GetDoctorServicesServices = GetDoctorServicesServices;
