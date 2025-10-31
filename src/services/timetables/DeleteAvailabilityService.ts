
import { ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class DeleteAvailabilityService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("O ID da disponibilidade é obrigatório.");
    }

    await this.timetablesRepository.deleteAvailability(id);
  }
}

export { DeleteAvailabilityService };
