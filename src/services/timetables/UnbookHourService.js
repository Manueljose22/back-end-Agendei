"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnbookHourService = void 0;
class UnbookHourService {
    timetablesRepository;
    constructor(timetablesRepository) {
        this.timetablesRepository = timetablesRepository;
    }
    async execute(timetableId) {
        if (!timetableId) {
            throw new Error("O ID do horário é obrigatório.");
        }
        await this.timetablesRepository.unbookHour(timetableId);
    }
}
exports.UnbookHourService = UnbookHourService;
