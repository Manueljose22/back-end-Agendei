import { adminSave, IAdminRepository } from "../../repositorys/admin/IAdminRepository";







class ProfileAdminServices {

    constructor(private IAdminRepository: IAdminRepository) { }


    async execute(userId: string): Promise<adminSave | null> {
        
        const admin = await this.IAdminRepository.findById(userId);

        // admin.password = ' ';
        
        return admin;
    }
}

export { ProfileAdminServices };