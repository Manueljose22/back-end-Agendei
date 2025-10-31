import { hash } from "bcrypt";
import { adminRequest, IAdminRepository } from "../../repositories/admin/IAdminRepository";






class UpdateAdminServices {

    constructor(private IAdminRepository: IAdminRepository) { }



    async execute(id: string, {name, email, password}: adminRequest): Promise<void | Error> {

        const admin = await this.IAdminRepository.findById(id);

        if (!admin) {
            throw new Error('doctor inválido!');
        }


        if (password) {
            password = await hash(password, 12)
        }



        const data = {
            name: name ?? admin?.name,
            email: email?? admin?.email,
            password: password ?? admin?.password
        }
        

        await this.IAdminRepository.update(id, data)
    }
}

export { UpdateAdminServices };