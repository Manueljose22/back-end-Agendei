import { IPatientsRepository, patientsSave } from "../../repositories/patients/IPatientsRepository";
import { PatientsRepository } from "../../repositories/patients/PatientsRepository";

class SearchPatientsServices {

  constructor(private patientsRepository: IPatientsRepository) {}

  async execute(query: string): Promise<patientsSave[] | null> {
    
    const patients = await this.patientsRepository.findSearch(query);

    return patients;
  }
}

export { SearchPatientsServices };
