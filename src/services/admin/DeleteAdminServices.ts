import { AppError } from "../../errors/AppError";
import { IAdminRepository } from "../../repositories/admin/IAdminRepository";





class DeleteAdminServices {

    constructor(private IUsersRepository: IAdminRepository) { }

    async execute(id: string): Promise<void> {

        const admin = await this.IUsersRepository.findById(id);

        if (!admin) {
            throw new AppError('Não existe este usuário.', 404);
        }

        await this.IUsersRepository.delete(id)
    }
}

export { DeleteAdminServices };