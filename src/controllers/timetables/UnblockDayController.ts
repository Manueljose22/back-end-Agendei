
import { Request, Response } from "express";
import { TimetablesRepository } from "../../../repositories/timetables/TimetablesRepository";
import { UnblockDayService } from "../../../services/timetables/UnblockDayService";

class UnblockDayController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const timetablesRepository = new TimetablesRepository();
    const unblockDayService = new UnblockDayService(timetablesRepository);

    try {
      await unblockDayService.execute(id);
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { UnblockDayController };
