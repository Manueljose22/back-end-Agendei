import { adminSave, IAdminRepository } from "../../repositories/admin/IAdminRepository";







class GetAdminByIdServices {

    constructor(private IAdminRepository: IAdminRepository) { }


    async execute(id: string): Promise<adminSave | null> {

        const admin = await this.IAdminRepository.findById(id);

        if (!admin) {
            throw new Error('Não existe este usuário!');
        }

        return admin;
    }
}

export { GetAdminByIdServices };