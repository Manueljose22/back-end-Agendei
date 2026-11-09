"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDoctorsServices = void 0;
class AddDoctorsServices {
    IDoctorsRepository;
    constructor(IDoctorsRepository) {
        this.IDoctorsRepository = IDoctorsRepository;
    }
    async execute(data) {
        const doctor = await this.IDoctorsRepository.findByName(data.name);
        if (doctor) {
            throw new Error('Já existe um registro com este nome!');
        }
        if (!data.name) {
            throw new Error('Preencha o campo nome!');
        }
        else if (!data.specialtyId) {
            throw new Error('Preencha o campo especialidade!');
        }
        await this.IDoctorsRepository.save(data);
    }
}
exports.AddDoctorsServices = AddDoctorsServices;
