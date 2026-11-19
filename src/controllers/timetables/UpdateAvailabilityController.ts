
import { NextFunction, Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { UpdateAvailabilityService } from "../../services/timetables/UpdateAvailabilityService";





class UpdateAvailabilityController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const { hourStart, hourEnd } = request.body;



    try {
      const timetablesRepository = new TimetablesRepository();
      const updateAvailabilityService = new UpdateAvailabilityService(timetablesRepository);

      await updateAvailabilityService.execute(id, { hourStart, hourEnd });

      return response.status(204).send();
    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new UpdateAvailabilityController;
