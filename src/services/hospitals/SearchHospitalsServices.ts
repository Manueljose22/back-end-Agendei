import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";


class SearchHospitalsServices {

  constructor(private hospitalsRepository: IHospitalsRepository) {}

  async execute(query: string): Promise<hospitalSave[] | null> {
    
    const hospitals = await this.hospitalsRepository.findSearch(query);

    return hospitals;
  }
}

export { SearchHospitalsServices };
