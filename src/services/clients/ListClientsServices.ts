import { IClientsRepository, clientsSave } from "../../repositorys/clients/IClientsRepository";







class ListClientsServices {

    constructor(private IClientsRepository: IClientsRepository) { }

    async execute(search: string): Promise<clientsSave[] | null> {

        const clients = await this.IClientsRepository.findAll(search);

        return clients;
    }
}

export { ListClientsServices };