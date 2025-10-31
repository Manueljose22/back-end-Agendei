import { hash } from "bcrypt";
import { createUsersToken } from "../../middlewares/auth/create-users-token";
import { adminRequest, adminSave, IAdminRepository } from "../../repositories/admin/IAdminRepository";





class AddAdminServices {

    constructor(private IAdminRepository: IAdminRepository) { }

    async execute({ name, email, password }: adminRequest): Promise<{user: adminSave, token: string} | Error> {

        const user = await this.IAdminRepository.findByEmail(email);
        
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

        const userCreated = await this.IAdminRepository.save({ name, email, password: passHash });
        
        const token = await createUsersToken(userCreated)

        return {
                user: {...userCreated, password: ''},
                token: token
        }
    }
}

export { AddAdminServices };