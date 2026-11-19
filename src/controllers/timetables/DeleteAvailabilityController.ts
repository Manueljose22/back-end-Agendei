
import { NextFunction, Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { DeleteAvailabilityService } from "../../services/timetables/DeleteAvailabilityService";


class DeleteAvailabilityController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;


    try {

      const timetablesRepository = new TimetablesRepository();
      const deleteAvailabilityService = new DeleteAvailabilityService(timetablesRepository);
      await deleteAvailabilityService.execute(id);
      return response.status(204).send();

    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new DeleteAvailabilityController;
