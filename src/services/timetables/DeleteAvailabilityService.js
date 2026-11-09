"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAvailabilityService = void 0;
class DeleteAvailabilityService {
    timetablesRepository;
    constructor(timetablesRepository) {
        this.timetablesRepository = timetablesRepository;
    }
    async execute(id) {
        if (!id) {
            throw new Error("O ID da disponibilidade é obrigatório.");
        }
        await this.timetablesRepository.deleteAvailability(id);
    }
}
exports.DeleteAvailabilityService = DeleteAvailabilityService;
