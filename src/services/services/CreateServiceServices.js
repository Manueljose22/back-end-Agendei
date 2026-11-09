"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceServices = void 0;
class CreateServiceServices {
    iserviceRepository;
    constructor(iserviceRepository) {
        this.iserviceRepository = iserviceRepository;
    }
    async execute(data) {
        const service = await this.iserviceRepository.findByName(data.title);
        if (service) {
            throw new Error('Já existe um registro com este nome!');
        }
        if (!data.title) {
            throw new Error('Preencha o campo nome!');
        }
        else if (!data.specialtyId) {
            throw new Error('Preencha o campo especialidade!');
        }
        await this.iserviceRepository.save(data);
    }
}
exports.CreateServiceServices = CreateServiceServices;
