import { IPatientsRepository, patientsSave } from "../../repositories/patients/IPatientsRepository";







class ProfilePatientsServices {

    constructor(private IPatientsRepository: IPatientsRepository) { }


    async execute(id: string): Promise<patientsSave | null> {
        
        const patient = await this.IPatientsRepository.findById(id);

        if (!patient) {
            throw new Error("Erro no servidor, por favor tente mais tarde!");
        }
        
        return patient;
    }
}

export { ProfilePatientsServices };