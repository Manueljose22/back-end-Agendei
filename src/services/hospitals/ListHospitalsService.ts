import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";




class ListHospitalsService {

    constructor(private IHospitalsRepository: IHospitalsRepository) {}

    async execute(): Promise<hospitalSave[] | null> {

        const listHospitals = await this.IHospitalsRepository.findList();

        if (!listHospitals) {
            throw new Error("Não há hospitais registrados.");
        }

        return listHospitals;
    }
}

export { ListHospitalsService };