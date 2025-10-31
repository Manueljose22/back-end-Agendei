
import { Request, Response } from "express";
import { TimetablesRepository } from "../../../repositories/timetables/TimetablesRepository";
import { BlockDayService } from "../../../services/timetables/BlockDayService";

class BlockDayController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const timetablesRepository = new TimetablesRepository();
    const blockDayService = new BlockDayService(timetablesRepository);

    try {
      await blockDayService.execute(id);
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { BlockDayController };
