
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class BlockDayService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("O ID da disponibilidade é obrigatório.");
    }

    await this.timetablesRepository.blockDay(id);
  }
}

export { BlockDayService };
