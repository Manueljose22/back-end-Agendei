import { AppError } from "../../errors/AppError";
import { IPatientsRepository, patientsSave } from "../../repositories/patients/IPatientsRepository";







class GetPatientsByIdServices {

    constructor(private IPatientsRepository: IPatientsRepository) { }


    async execute(id: string): Promise<patientsSave | null> {

        const client = await this.IPatientsRepository.findById(id);

        if (!client) {
            throw new AppError("Paciente não existe!", 404);
        }

        return client;
    }
}

export { GetPatientsByIdServices };