
import { Request, Response } from "express";
import { TimetablesRepository } from "../../../repositories/timetables/TimetablesRepository";
import { BookHourService } from "../../../services/timetables/BookHourService";

class BookHourController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { timetableId } = request.params;

    const timetablesRepository = new TimetablesRepository();
    const bookHourService = new BookHourService(timetablesRepository);

    try {
      await bookHourService.execute(timetableId);
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { BookHourController };
