
import { Request, Response } from "express";
import { TimetablesRepository } from "../../../repositories/timetables/TimetablesRepository";
import { GetAvailabilityByDoctorService } from "../../../services/timetables/GetAvailabilityByDoctorService";

class GetAvailabilityByDoctorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { doctorId } = request.params;

    const timetablesRepository = new TimetablesRepository();
    const getAvailabilityByDoctorService = new GetAvailabilityByDoctorService(timetablesRepository);

    try {
      const availabilities = await getAvailabilityByDoctorService.execute(doctorId);
      return response.json(availabilities);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export { GetAvailabilityByDoctorController };
