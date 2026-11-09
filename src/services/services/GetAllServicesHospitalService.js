"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllServicesHospitalService = void 0;
class GetAllServicesHospitalService {
    IServiceRepository;
    constructor(IServiceRepository) {
        this.IServiceRepository = IServiceRepository;
    }
    async execute(hospitalId) {
        const services = await this.IServiceRepository.findAllHospital(hospitalId);
        return services;
    }
}
exports.GetAllServicesHospitalService = GetAllServicesHospitalService;
