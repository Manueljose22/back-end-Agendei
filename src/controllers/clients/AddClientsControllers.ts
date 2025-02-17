import { Request, Response } from 'express';
import { clientsRequest} from '../../repositorys/clients/IClientsRepository';
import { AddClientsServices } from '../../services/clients/AddClientsServices';
import { ClientsRepository } from '../../repositorys/clients/ClientsRepository';





class AddClientsControllers {
    
    async handle(request: Request, response: Response) {
        
        const data = request.body as clientsRequest;
        
        try {

            const clientsRepository = new ClientsRepository();
            const service = new AddClientsServices(clientsRepository);

            const result = await service.execute(data);

            return response.status(201).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new AddClientsControllers;