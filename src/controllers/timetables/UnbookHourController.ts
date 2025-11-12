
import { Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { UnbookHourService } from "../../services/timetables/UnbookHourService";


class UnbookHourController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { timetableId } = request.params;

    try {

      const timetablesRepository = new TimetablesRepository();
      const unbookHourService = new UnbookHourService(timetablesRepository);

      await unbookHourService.execute(timetableId);

      return response.status(204).send();
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new UnbookHourController;
