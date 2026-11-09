"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceToDoctorServices = void 0;
class ServiceToDoctorServices {
    IDoctorRepository;
    constructor(IDoctorRepository) {
        this.IDoctorRepository = IDoctorRepository;
    }
    async execute({ serviceId, doctorId, price }) {
        await this.IDoctorRepository.serviceToDoctor({ serviceId, doctorId, price });
    }
}
exports.ServiceToDoctorServices = ServiceToDoctorServices;
