
import { Request, Response } from "express";
import { TimetablesRepository } from "../../repositories/timetables/TimetablesRepository";
import { GetAvailabilityByDoctorService } from "../../services/timetables/GetAvailabilityByDoctorService";




class GetAvailabilityByDoctorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { doctorId } = request.params;



    try {
      const timetablesRepository = new TimetablesRepository();
      const getAvailabilityByDoctorService = new GetAvailabilityByDoctorService(timetablesRepository);

      const availabilities = await getAvailabilityByDoctorService.execute(doctorId);
      return response.json(availabilities);

    } catch (error:any) {
      return response.status(400).json({ error: error.message });
    }
  }
}

export default new GetAvailabilityByDoctorController;
