"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockDayService = void 0;
class BlockDayService {
    timetablesRepository;
    constructor(timetablesRepository) {
        this.timetablesRepository = timetablesRepository;
    }
    async execute(id) {
        if (!id) {
            throw new Error("O ID da disponibilidade é obrigatório.");
        }
        await this.timetablesRepository.blockDay(id);
    }
}
exports.BlockDayService = BlockDayService;
