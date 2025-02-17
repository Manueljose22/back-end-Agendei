import { hash } from "bcrypt";
import { IClientsRepository, clientsRequest, clientsSave } from "../../repositorys/clients/IClientsRepository";
import { createUsersToken } from "../../middlewares/auth/create-users-token";





class AddClientsServices {

    constructor(private IClientsRepository: IClientsRepository) { }

    async execute({ name, email, password }: clientsRequest): Promise<{user: clientsSave, token: string} | Error> {

        const user = await this.IClientsRepository.findByEmail(email);
        
        if (user) {
            throw new Error('Já existe um registro com este nome!');
        }

        if (!name) {
            throw new Error('Preencha o campo nome.');
        } else if (!email) {
            throw new Error('Preencha o campo email.');
        } else if (!password) {
            throw new Error('Crie uma senha, por favor.');
        }

        const passHash = await hash(password, 12);

        const userCreated = await this.IClientsRepository.save({ name, email, password: passHash });
        
        const token = await createUsersToken(userCreated)

        return {
                user: userCreated,
                token: token
        }
    }
}

export { AddClientsServices };