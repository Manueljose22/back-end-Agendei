import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { CreateAvailabilityService } from "../../services/timetables/CreateAvailabilityService";

class CreateAvailabilityController {
  async handle(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.body || typeof request.body !== "object" || Array.isArray(request.body)) {
        throw new AppError("O corpo do pedido é obrigatório e deve ser um objecto JSON.", 400);
      }

      const { doctorId, date, hourStart, hourEnd } = request.body;

      const timetablesRepository = new TimetablesRepository();
      const createAvailabilityService = new CreateAvailabilityService(timetablesRepository);

      await createAvailabilityService.execute({ doctorId, date, hourStart, hourEnd });
      return response.status(201).send();
    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new CreateAvailabilityController();
