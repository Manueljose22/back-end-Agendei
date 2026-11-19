import { AppError } from "../../errors/AppError";

import { IUpdateAvailability, ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class UpdateAvailabilityService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(id: string, data: IUpdateAvailability): Promise<void> {
    if (!id) {
      throw new AppError("O ID da disponibilidade é obrigatório.", 400);
    }

    if (!data.hourStart || !data.hourEnd) {
      throw new AppError("As horas de início e fim são obrigatórias.", 400);
    }

    if (new Date(data.hourEnd) <= new Date(data.hourStart)) {
      throw new AppError("A hora de término deve ser após a hora de início.", 400);
    }

    await this.timetablesRepository.updateAvailability(id, data);
  }
}

export { UpdateAvailabilityService };
