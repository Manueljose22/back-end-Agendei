
import { NextFunction, Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { UnblockDayService } from "../../services/timetables/UnblockDayService";




class UnblockDayController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    try {

      const timetablesRepository = new TimetablesRepository();
      const unblockDayService = new UnblockDayService(timetablesRepository);
      await unblockDayService.execute(id);
      return response.status(204).send();


    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new UnblockDayController;
