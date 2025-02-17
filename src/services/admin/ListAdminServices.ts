import { adminSave, IAdminRepository } from "../../repositorys/admin/IAdminRepository";







class ListAdminServices {

    constructor(private IAdminRepository: IAdminRepository) { }

    async execute(search: string): Promise<adminSave[] | null> {

        const admins = await this.IAdminRepository.findAll(search);

        return admins;
    }
}

export { ListAdminServices };