import { IPatientsRepository, patientsSave } from "../../repositories/patients/IPatientsRepository";







class ListPatientsServices {

    constructor(private IPatientsRepository: IPatientsRepository) { }

    async execute(search: string): Promise<patientsSave[] | null> {

        const patients = await this.IPatientsRepository.findAll(search);

        return patients;
    }
}

export { ListPatientsServices };