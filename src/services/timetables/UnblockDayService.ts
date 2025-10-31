
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class UnblockDayService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("O ID da disponibilidade é obrigatório.");
    }

    await this.timetablesRepository.unblockDay(id);
  }
}

export { UnblockDayService };
