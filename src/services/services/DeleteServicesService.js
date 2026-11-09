"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteServicesService = void 0;
class DeleteServicesService {
    IServiceRepository;
    constructor(IServiceRepository) {
        this.IServiceRepository = IServiceRepository;
    }
    async execute(id) {
        const service = await this.IServiceRepository.findById(id);
        if (!service) {
            throw new Error('Serviço invalido!');
        }
        await this.IServiceRepository.delete(id);
    }
}
exports.DeleteServicesService = DeleteServicesService;
