import { Request, Response } from "express";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";
import { SearchSpecialitiesServices } from "../../services/specialities/SearchSpecialitiesServices";


class SearchSpecialitiesControllers {

  async handle(request: Request, response: Response) {

    const { q } = request.query;

    try {

      if (typeof q !== 'string') {
        throw new Error("Query parameter 'q' must be a string.");
      }

      const specialityRepository = new SpecialityRepository();
      const searchSpecialitiesServices = new SearchSpecialitiesServices(specialityRepository);

      const specialities = await searchSpecialitiesServices.execute(q);
      
      return response.status(200).json(specialities);

    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }
}

export default new SearchSpecialitiesControllers;
