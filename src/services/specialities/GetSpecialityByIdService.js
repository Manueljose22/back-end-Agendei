"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSpecialityByIdService = void 0;
class GetSpecialityByIdService {
    ISpecialityRepository;
    constructor(ISpecialityRepository) {
        this.ISpecialityRepository = ISpecialityRepository;
    }
    async execute(id) {
        const speciality = await this.ISpecialityRepository.findById(id);
        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }
        return speciality;
    }
}
exports.GetSpecialityByIdService = GetSpecialityByIdService;
