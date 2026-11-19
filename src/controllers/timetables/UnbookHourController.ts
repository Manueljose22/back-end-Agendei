
import { NextFunction, Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { UnbookHourService } from "../../services/timetables/UnbookHourService";


class UnbookHourController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { timetableId } = request.params;

    try {

      const timetablesRepository = new TimetablesRepository();
      const unbookHourService = new UnbookHourService(timetablesRepository);

      await unbookHourService.execute(timetableId);

      return response.status(204).send();
    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new UnbookHourController;
