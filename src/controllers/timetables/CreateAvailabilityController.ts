import { NextFunction, Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { CreateAvailabilityService } from "../../services/timetables/CreateAvailabilityService";





class CreateAvailabilityController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { doctorId, date, hourStart, hourEnd } = request.body;

    const timetablesRepository = new TimetablesRepository();
    const createAvailabilityService = new CreateAvailabilityService(timetablesRepository);

    try {
      await createAvailabilityService.execute({ doctorId, date, hourStart, hourEnd });
      return response.status(201).send();
    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new CreateAvailabilityController;
