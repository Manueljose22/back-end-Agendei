import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { SpecialityRepository } from "../../repositories/specialities/SpecialityRepository";
import { SearchSpecialitiesServices } from "../../services/specialities/SearchSpecialitiesServices";


class SearchSpecialitiesControllers {

  async handle(request: Request, response: Response, next: NextFunction) {

    const { q } = request.query;

    try {

      if (typeof q !== 'string') {
        throw new AppError("O parâmetro q deve ser um texto.", 400);
      }

      const specialityRepository = new SpecialityRepository();
      const searchSpecialitiesServices = new SearchSpecialitiesServices(specialityRepository);

      const specialities = await searchSpecialitiesServices.execute(q);
      
      return response.status(200).json(specialities);

    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new SearchSpecialitiesControllers;
