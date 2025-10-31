
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class UnbookHourService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(timetableId: string): Promise<void> {
    if (!timetableId) {
      throw new Error("O ID do horário é obrigatório.");
    }

    await this.timetablesRepository.unbookHour(timetableId);
  }
}

export { UnbookHourService };
