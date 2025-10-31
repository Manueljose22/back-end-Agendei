
import { Request, Response } from "express";
import { TimetablesRepository } from "../../../repositories/timetables/TimetablesRepository";
import { DeleteAvailabilityService } from "../../../services/timetables/DeleteAvailabilityService";

class DeleteAvailabilityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const timetablesRepository = new TimetablesRepository();
    const deleteAvailabilityService = new DeleteAvailabilityService(timetablesRepository);

    try {
      await deleteAvailabilityService.execute(id);
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { DeleteAvailabilityController };
