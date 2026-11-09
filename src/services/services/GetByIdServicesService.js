"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetByIdServicesService = void 0;
class GetByIdServicesService {
    IServiceRepository;
    constructor(IServiceRepository) {
        this.IServiceRepository = IServiceRepository;
    }
    async execute(id) {
        const service = await this.IServiceRepository.findById(id);
        if (!service) {
            throw new Error('Serviço invalido!');
        }
        return service;
    }
}
exports.GetByIdServicesService = GetByIdServicesService;
