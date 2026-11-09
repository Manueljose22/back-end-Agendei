"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAdminServices = void 0;
class DeleteAdminServices {
    IUsersRepository;
    constructor(IUsersRepository) {
        this.IUsersRepository = IUsersRepository;
    }
    async execute(id) {
        const admin = await this.IUsersRepository.findById(id);
        if (!admin) {
            throw new Error('Não existe este usuário.');
        }
        await this.IUsersRepository.delete(id);
    }
}
exports.DeleteAdminServices = DeleteAdminServices;
