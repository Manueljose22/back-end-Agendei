
import { NextFunction, Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { BlockDayService } from "../../services/timetables/BlockDayService";


class BlockDayController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;

    const timetablesRepository = new TimetablesRepository();
    const blockDayService = new BlockDayService(timetablesRepository);

    try {
      await blockDayService.execute(id);
      return response.status(204).send();
    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new  BlockDayController;;
