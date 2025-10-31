import { HospitalsRepository } from "../../repositories/hospitals/HospitalsRepository";
import { hospitalSave, IHospitalsRepository } from "../../repositories/hospitals/IHospitalsRepository";




class ListHospitalsService {

    private IHospitalsRepository: IHospitalsRepository;

    constructor() {
        this.IHospitalsRepository = new HospitalsRepository();
    }

    async execute(): Promise<hospitalSave[] | null> {

        const listHospitals = await this.IHospitalsRepository.findList();

        if (!listHospitals) {
            throw new Error("Não há hospitais registrados.");
        }

        return listHospitals;
    }
}

export { ListHospitalsService };