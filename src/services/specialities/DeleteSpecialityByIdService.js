"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSpecialityByIdService = void 0;
class DeleteSpecialityByIdService {
    ISpecialityRepository;
    constructor(ISpecialityRepository) {
        this.ISpecialityRepository = ISpecialityRepository;
    }
    async execute(id) {
        const speciality = await this.ISpecialityRepository.findById(id);
        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }
        await this.ISpecialityRepository.delete(id);
    }
}
exports.DeleteSpecialityByIdService = DeleteSpecialityByIdService;
