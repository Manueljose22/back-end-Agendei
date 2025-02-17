import { Request, Response } from 'express';
import { ClientsRepository } from '../../repositorys/clients/ClientsRepository';
import { DeleteClientsServices } from '../../services/clients/DeleteClientsServices';





class DeleteClientsControllers {
    async handle(request: Request, response: Response) {
        
        const { id } = request.params;

        try {

            const clientsRepository = new ClientsRepository();
            const service = new DeleteClientsServices(clientsRepository);

            const result = await service.execute(id);

            return response.status(200).json({ message: 'Registro excluído com sucesso.' })

        } catch (error: any) {
            return response.status(400).json({ message: error.message })
        }
    }
}

export default new DeleteClientsControllers;