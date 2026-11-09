"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListHospitalsService = void 0;
class ListHospitalsService {
    IHospitalsRepository;
    constructor(IHospitalsRepository) {
        this.IHospitalsRepository = IHospitalsRepository;
    }
    async execute() {
        const listHospitals = await this.IHospitalsRepository.findList();
        if (!listHospitals) {
            throw new Error("Não há hospitais registrados.");
        }
        return listHospitals;
    }
}
exports.ListHospitalsService = ListHospitalsService;
