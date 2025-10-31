import { IPatientsRepository } from "../../repositories/patients/IPatientsRepository";





class DeletePatientsServices {

    constructor(private IPatientsRepository: IPatientsRepository) { }

    async execute(id: string): Promise<void> {

        const user = await this.IPatientsRepository.findById(id);

        if (!user) {
            throw new Error('Não existe este usuário.');
        }

        await this.IPatientsRepository.delete(id)
    }
}

export { DeletePatientsServices };