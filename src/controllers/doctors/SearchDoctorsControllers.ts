import { Request, Response } from "express";
import { DoctorsRepository } from "../../repositories/doctors/DoctorsRepository";
import { SearchDoctorsServices } from "../../services/doctors/SearchDoctorsServices";


class SearchDoctorsControllers {

  async handle(request: Request, response: Response) {

    const { q } = request.query;

    try {

      if (typeof q !== 'string') {
        throw new Error("Query parameter 'q' must be a string.");
      }

      const doctorsRepository = new DoctorsRepository();
      const searchDoctorsServices = new SearchDoctorsServices(doctorsRepository);

      const doctors = await searchDoctorsServices.execute(q);
      
      return response.status(200).json(doctors);

    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }
}

export default new SearchDoctorsControllers;
