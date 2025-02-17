import { Request, Response } from 'express';
import { ClientsRepository } from '../../repositorys/clients/ClientsRepository';
import { ListClientsServices } from '../../services/clients/ListClientsServices';





class ListClientsController {

    async handle(request: Request, response: Response) {

        const { search } = request.query;

        try {

            const clientsRepository = new ClientsRepository();
            const service = new ListClientsServices(clientsRepository);

            const result = await service.execute(search as string);

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new ListClientsController;