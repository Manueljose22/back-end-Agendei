import { Request, Response } from 'express';
import { ClientsRepository } from '../../repositorys/clients/ClientsRepository';
import { ProfileClientsServices } from '../../services/clients/ProfileClientsServices';





class ProfileClientsControllers {

    async handle(request: Request, response: Response) {

        const { userId } = request;
        
        try {

            const clientsRepository = new ClientsRepository();
            const service = new ProfileClientsServices(clientsRepository);

            const result = await service.execute(userId)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ProfileClientsControllers;