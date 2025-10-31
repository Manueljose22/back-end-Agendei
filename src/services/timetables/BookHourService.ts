
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class BookHourService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(timetableId: string): Promise<void> {
    if (!timetableId) {
      throw new Error("O ID do horário é obrigatório.");
    }

    await this.timetablesRepository.bookHour(timetableId);
  }
}

export { BookHourService };
