
import { NextFunction, Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { GetAvailabilityByDoctorService } from "../../services/timetables/GetAvailabilityByDoctorService";




class GetAvailabilityByDoctorController {
  async handle(request: Request, response: Response, next: NextFunction) {
    const { doctorId } = request.params;



    try {
      const timetablesRepository = new TimetablesRepository();
      const getAvailabilityByDoctorService = new GetAvailabilityByDoctorService(timetablesRepository);

      const availabilities = await getAvailabilityByDoctorService.execute(doctorId);
      return response.json(availabilities);

    } catch (error: unknown) {
      return next(error);
    }
  }
}

export default new GetAvailabilityByDoctorController;
