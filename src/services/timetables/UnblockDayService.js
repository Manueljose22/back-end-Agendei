"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnblockDayService = void 0;
class UnblockDayService {
    timetablesRepository;
    constructor(timetablesRepository) {
        this.timetablesRepository = timetablesRepository;
    }
    async execute(id) {
        if (!id) {
            throw new Error("O ID da disponibilidade é obrigatório.");
        }
        await this.timetablesRepository.unblockDay(id);
    }
}
exports.UnblockDayService = UnblockDayService;
