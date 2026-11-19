import { AppError } from "../../errors/AppError";

import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class UnblockDayService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new AppError("O ID da disponibilidade é obrigatório.", 400);
    }

    await this.timetablesRepository.unblockDay(id);
  }
}

export { UnblockDayService };
