"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllServicesService = void 0;
class GetAllServicesService {
    IServiceRepository;
    constructor(IServiceRepository) {
        this.IServiceRepository = IServiceRepository;
    }
    async execute() {
        const service = await this.IServiceRepository.findAll();
        return service;
    }
}
exports.GetAllServicesService = GetAllServicesService;
