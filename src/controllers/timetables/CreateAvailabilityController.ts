
import { Request, Response } from "express";
import { TimetablesRepository } from "../../../repositories/timetables/TimetablesRepository";
import { CreateAvailabilityService } from "../../../services/timetables/CreateAvailabilityService";

class CreateAvailabilityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { doctor_id, date, hourStart, hourEnd } = request.body;

    const timetablesRepository = new TimetablesRepository();
    const createAvailabilityService = new CreateAvailabilityService(timetablesRepository);

    try {
      await createAvailabilityService.execute({ doctor_id, date, hourStart, hourEnd });
      return response.status(201).send();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { CreateAvailabilityController };
