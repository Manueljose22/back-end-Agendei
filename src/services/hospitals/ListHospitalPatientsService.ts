import { IPatientsRepository, patientsSave } from "../../repositories/patients/IPatientsRepository";

class ListHospitalPatientsService {
    constructor(private patientsRepository: IPatientsRepository) {}

    async execute(hospitalId: string, search = ""): Promise<patientsSave[]> {
        return this.patientsRepository.findByHospital(hospitalId, search.trim());
    }
}

export { ListHospitalPatientsService };
