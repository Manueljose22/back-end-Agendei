import { Request, Response } from "express";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";
import { SearchPatientsServices } from "../../services/patients/SearchPatientsServices";


class SearchPatientsControllers {

  async handle(request: Request, response: Response) {

    const { q } = request.query;

    try {

      if (typeof q !== 'string') {
        throw new Error("Query parameter 'q' must be a string.");
      }

      const patientsRepository = new PatientsRepository();
      const searchPatientsServices = new SearchPatientsServices(patientsRepository);

      const patients = await searchPatientsServices.execute(q);
      
      return response.status(200).json(patients);

    } catch (error: any) {
      return response.status(400).json({ message: error.message });
    }
  }
}

export default new SearchPatientsControllers;
