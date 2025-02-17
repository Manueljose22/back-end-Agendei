import { Request, Response } from 'express';
import { ClientsRepository } from '../../repositorys/clients/ClientsRepository';
import { GetClientsByIdServices } from '../../services/clients/GetClientsByIdServices';





class GetClientsByIdControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;

        try {

            const clientsRepository = new ClientsRepository();
            const service = new GetClientsByIdServices(clientsRepository);

            const result = await service.execute(id)

            return response.status(200).json(result);

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new GetClientsByIdControllers;