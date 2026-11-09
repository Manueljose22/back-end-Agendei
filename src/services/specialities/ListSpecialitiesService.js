"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSpecialitiesService = void 0;
class ListSpecialitiesService {
    ISpecialityRepository;
    constructor(ISpecialityRepository) {
        this.ISpecialityRepository = ISpecialityRepository;
    }
    async execute() {
        const listSpeciality = await this.ISpecialityRepository.findAll();
        if (!listSpeciality) {
            throw new Error("Não há Especialidade registrados.");
        }
        return listSpeciality;
    }
}
exports.ListSpecialitiesService = ListSpecialitiesService;
