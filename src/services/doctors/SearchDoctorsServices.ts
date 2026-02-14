import { doctorSave, IDoctorsRepository } from "../../repositories/doctors/IDoctorsRepository";


class SearchDoctorsServices {

  constructor(private doctorsRepository: IDoctorsRepository) {}

  async execute(query: string): Promise<doctorSave[] | null> {
    
    const doctors = await this.doctorsRepository.findSearch(query);

    return doctors;
  }
}

export { SearchDoctorsServices };
