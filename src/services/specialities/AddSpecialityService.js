"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSpecialityService = void 0;
class AddSpecialityService {
    ISpecialityRepository;
    constructor(ISpecialityRepository) {
        this.ISpecialityRepository = ISpecialityRepository;
    }
    async execute(data) {
        const speciality = await this.ISpecialityRepository.findByName(data.name);
        if (speciality) {
            throw new Error("Especialidade já existe!");
        }
        if (!data.name) {
            throw new Error("Por favor, preencha o campo nome");
        }
        const newSpeciality = await this.ISpecialityRepository.create(data);
        return newSpeciality;
    }
}
exports.AddSpecialityService = AddSpecialityService;
