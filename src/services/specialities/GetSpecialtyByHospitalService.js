"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSpecialtyByHospitalService = void 0;
class GetSpecialtyByHospitalService {
    ISpecialityRepository;
    constructor(ISpecialityRepository) {
        this.ISpecialityRepository = ISpecialityRepository;
    }
    async execute(id) {
        const speciality = await this.ISpecialityRepository.findByHospitails(id);
        if (!speciality) {
            throw new Error("Nenhum especialidade foi registrada.");
        }
        return speciality;
    }
}
exports.GetSpecialtyByHospitalService = GetSpecialtyByHospitalService;
