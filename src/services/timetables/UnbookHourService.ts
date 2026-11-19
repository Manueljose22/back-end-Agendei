import { AppError } from "../../errors/AppError";

import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class UnbookHourService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(timetableId: string): Promise<void> {
    if (!timetableId) {
      throw new AppError("O ID do horário é obrigatório.", 400);
    }

    await this.timetablesRepository.unbookHour(timetableId);
  }
}

export { UnbookHourService };
