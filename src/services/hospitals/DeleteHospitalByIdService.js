"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteHospitalByIdService = void 0;
class DeleteHospitalByIdService {
    IHospitalsRepository;
    constructor(IHospitalsRepository) {
        this.IHospitalsRepository = IHospitalsRepository;
    }
    async execute(id) {
        const hospital = await this.IHospitalsRepository.findById(id);
        if (!hospital) {
            throw new Error("Hospital não existe.");
        }
        await this.IHospitalsRepository.delete(id);
    }
}
exports.DeleteHospitalByIdService = DeleteHospitalByIdService;
