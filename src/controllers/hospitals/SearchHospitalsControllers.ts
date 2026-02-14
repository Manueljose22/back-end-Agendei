import { Request, Response } from "express";
import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { SearchHospitalsServices } from "../../services/hospitals/SearchHospitalsServices";


class SearchHospitalsControllers {

  async handle(request: Request, response: Response) {

    const { q } = request.query;

    try {

      if (typeof q !== 'string') {
        throw new Error("Query parameter 'q' must be a string.");
      }

      const hospitalsRepository = new HospitalsRepository();
      const searchHospitalsServices = new SearchHospitalsServices(hospitalsRepository);

      const hospitals = await searchHospitalsServices.execute(q);
      
      return response.status(200).json(hospitals);

    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }
}

export default new SearchHospitalsControllers;
