
import { IUpdateAvailability, ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class UpdateAvailabilityService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(id: string, data: IUpdateAvailability): Promise<void> {
    if (!id) {
      throw new Error("O ID da disponibilidade é obrigatório.");
    }

    if (!data.hourStart || !data.hourEnd) {
      throw new Error("As horas de início e fim são obrigatórias.");
    }

    if (new Date(data.hourEnd) <= new Date(data.hourStart)) {
      throw new Error("A hora de término deve ser após a hora de início.");
    }

    await this.timetablesRepository.updateAvailability(id, data);
  }
}

export { UpdateAvailabilityService };
