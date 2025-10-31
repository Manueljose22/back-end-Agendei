
import { IAvailabilityInput, ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class CreateAvailabilityService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(data: IAvailabilityInput): Promise<void> {
    // Validação dos dados de entrada
    if (!data.doctor_id || !data.date || !data.hourStart || !data.hourEnd) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    // Validação da data e horas
    const now = new Date();
    if (new Date(data.date) < now) {
      throw new Error("A data de disponibilidade não pode ser no passado.");
    }

    if (new Date(data.hourEnd) <= new Date(data.hourStart)) {
      throw new Error("A hora de término deve ser após a hora de início.");
    }

    // Criar a disponibilidade
    await this.timetablesRepository.createAvailability(data);

    // Gerar os horários
    const availability = await this.timetablesRepository.getAvailabilityByDate(data.doctor_id, data.date.toISOString());
    if (availability.length > 0) {
      const newAvailability = availability[availability.length - 1];
      await this.timetablesRepository.generateHours(newAvailability.id, data.hourStart.toTimeString().substring(0, 5), data.hourEnd.toTimeString().substring(0, 5));
    }
  }
}

export { CreateAvailabilityService };
