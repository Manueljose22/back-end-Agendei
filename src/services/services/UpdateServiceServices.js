"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceServices = void 0;
class UpdateServiceServices {
    iserviceRepository;
    constructor(iserviceRepository) {
        this.iserviceRepository = iserviceRepository;
    }
    async execute(id, data) {
        const service = await this.iserviceRepository.findById(id);
        if (!service) {
            throw new Error('Serviço invalido!');
        }
        console.log(data);
        const updateData = {
            id: service.id,
            title: data.title ?? service.title,
            description: data.title ?? service.title,
            duraction: data.duraction ?? service.duraction,
            status: data.status ?? service.status,
            specialtyId: data.specialtyId ?? service.specialtyId,
            price: data.price ?? service.price
        };
        await this.iserviceRepository.update(id, updateData);
    }
}
exports.UpdateServiceServices = UpdateServiceServices;
