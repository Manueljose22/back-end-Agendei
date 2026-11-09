"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHospitalByIdService = void 0;
class GetHospitalByIdService {
    IHospitalsRepository;
    constructor(IHospitalsRepository) {
        this.IHospitalsRepository = IHospitalsRepository;
    }
    async execute(id) {
        const hospital = await this.IHospitalsRepository.findById(id);
        if (!hospital) {
            throw new Error("Hospital não existe.");
        }
        return hospital;
    }
}
exports.GetHospitalByIdService = GetHospitalByIdService;
