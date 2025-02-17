import { hash } from "bcrypt";
import { IClientsRepository, clientsRequest } from "../../repositorys/clients/IClientsRepository";






class UpdateClientsServices {

    constructor(private IClientsRepository: IClientsRepository) { }



    async execute(id: string, {name, email, password}: clientsRequest): Promise<void | Error> {

        const client = await this.IClientsRepository.findById(id);

        if (!client) {
            throw new Error('usuário inválido!');
        }


        if (password) {
            password = await hash(password, 12)
        }



        const data = {
            name: name ?? client?.name,
            email: email?? client?.email,
            password: password ?? client?.password
        }
        

        await this.IClientsRepository.update(id, data)
    }
}

export { UpdateClientsServices };