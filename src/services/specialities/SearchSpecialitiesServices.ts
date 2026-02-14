import { ISpecialityRepository, specialitySaved } from "../../repositories/specialities/ISpecialityRepository";


class SearchSpecialitiesServices {

  constructor(private specialityRepository: ISpecialityRepository) {}

  async execute(query: string): Promise<specialitySaved[] | null> {
    
    const specialities = await this.specialityRepository.findSearch(query);

    return specialities;
  }
}

export { SearchSpecialitiesServices };
