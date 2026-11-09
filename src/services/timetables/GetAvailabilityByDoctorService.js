"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailabilityByDoctorService = void 0;
class GetAvailabilityByDoctorService {
    timetablesRepository;
    constructor(timetablesRepository) {
        this.timetablesRepository = timetablesRepository;
    }
    async execute(doctorId) {
        if (!doctorId) {
            throw new Error("O ID do médico é obrigatório.");
        }
        return this.timetablesRepository.getAvailabilityByDoctor(doctorId);
    }
}
exports.GetAvailabilityByDoctorService = GetAvailabilityByDoctorService;
