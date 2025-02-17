import { IClientsRepository, clientsSave } from "../../repositorys/clients/IClientsRepository";







class ProfileClientsServices {

    constructor(private IClientsRepository: IClientsRepository) { }


    async execute(clientId: string): Promise<clientsSave | null> {
        
        const client = await this.IClientsRepository.findById(clientId);

        // delete client.password;
        
        return client;
    }
}

export { ProfileClientsServices };