import { Request, Response } from 'express';
import { clientsRequest } from '../../repositorys/clients/IClientsRepository';
import { UpdateClientsServices } from '../../services/clients/UpdateClientsServices';
import { ClientsRepository } from '../../repositorys/clients/ClientsRepository';





class UpdateClientsControllers {

    async handle(request: Request, response: Response) {

        const { id } = request.params;
        const data = request.body as clientsRequest;

        try {

            const clientsRepository = new ClientsRepository();
            const service = new UpdateClientsServices(clientsRepository);

            const result = await service.execute(id, data);

            return response.json({message: 'Dados actualizados com sucesso.'});

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new UpdateClientsControllers;