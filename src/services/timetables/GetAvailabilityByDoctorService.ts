
import { IAvailability, ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class GetAvailabilityByDoctorService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(doctorId: string): Promise<IAvailability[]> {
    if (!doctorId) {
      throw new Error("O ID do médico é obrigatório.");
    }

    return this.timetablesRepository.getAvailabilityByDoctor(doctorId);
  }
}

export { GetAvailabilityByDoctorService };
