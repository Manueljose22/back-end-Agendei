import { IClientsRepository } from "../../repositorys/clients/IClientsRepository";





class DeleteClientsServices {

    constructor(private IClientsRepository: IClientsRepository) { }

    async execute(id: string): Promise<void> {

        const user = await this.IClientsRepository.findById(id);

        if (!user) {
            throw new Error('Não existe este usuário.');
        }

        await this.IClientsRepository.delete(id)
    }
}

export { DeleteClientsServices };