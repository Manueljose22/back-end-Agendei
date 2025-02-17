import { clientsSave, IClientsRepository } from "../../repositorys/clients/IClientsRepository";







class GetClientsByIdServices {

    constructor(private IClientsRepository: IClientsRepository) { }


    async execute(id: string): Promise<clientsSave | null> {

        const client = await this.IClientsRepository.findById(id);

        if (!client) {
            throw new Error('Não existe este usuário!');
        }

        return client;
    }
}

export { GetClientsByIdServices };