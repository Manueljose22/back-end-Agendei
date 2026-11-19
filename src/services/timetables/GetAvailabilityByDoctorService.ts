import { AppError } from "../../errors/AppError";
import { IAvailability, ITimetablesRepository } from "../../repositories/timetables/ITimetablesRepository";

class GetAvailabilityByDoctorService {
  constructor(private timetablesRepository: ITimetablesRepository) {}

  async execute(doctorId: string): Promise<IAvailability[]> {
    if (!doctorId) {
      throw new AppError("O ID do médico é obrigatório.", 400);
    }

    return this.timetablesRepository.getAvailabilityByDoctor(doctorId);
  }
}

export { GetAvailabilityByDoctorService };
