"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailabilityService = void 0;
class UpdateAvailabilityService {
    timetablesRepository;
    constructor(timetablesRepository) {
        this.timetablesRepository = timetablesRepository;
    }
    async execute(id, data) {
        if (!id) {
            throw new Error("O ID da disponibilidade é obrigatório.");
        }
        if (!data.hourStart || !data.hourEnd) {
            throw new Error("As horas de início e fim são obrigatórias.");
        }
        if (new Date(data.hourEnd) <= new Date(data.hourStart)) {
            throw new Error("A hora de término deve ser após a hora de início.");
        }
        await this.timetablesRepository.updateAvailability(id, data);
    }
}
exports.UpdateAvailabilityService = UpdateAvailabilityService;
