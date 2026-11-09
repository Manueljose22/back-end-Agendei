"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookHourService = void 0;
class BookHourService {
    timetablesRepository;
    constructor(timetablesRepository) {
        this.timetablesRepository = timetablesRepository;
    }
    async execute(timetableId) {
        if (!timetableId) {
            throw new Error("O ID do horário é obrigatório.");
        }
        await this.timetablesRepository.bookHour(timetableId);
    }
}
exports.BookHourService = BookHourService;
