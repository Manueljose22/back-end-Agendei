"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpecialityService = void 0;
class UpdateSpecialityService {
    ISpecialityRepository;
    constructor(ISpecialityRepository) {
        this.ISpecialityRepository = ISpecialityRepository;
    }
    async execute(id, data) {
        const speciality = await this.ISpecialityRepository.findById(id);
        if (!speciality) {
            throw new Error("Especialidade não existe.");
        }
        const newData = {
            name: data.name ?? speciality.name,
            description: data.description ?? speciality.description,
            color: data.color ?? speciality.color
        };
        await this.ISpecialityRepository.update(id, newData);
    }
}
exports.UpdateSpecialityService = UpdateSpecialityService;
