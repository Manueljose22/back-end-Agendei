"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDoctorsServices = void 0;
class DeleteDoctorsServices {
    IDoctorsRepository;
    constructor(IDoctorsRepository) {
        this.IDoctorsRepository = IDoctorsRepository;
    }
    async execute(hospitalId, id) {
        const doctor = await this.IDoctorsRepository.findById(id);
        if (doctor?.Hospital?.id !== hospitalId) {
            throw new Error('Não é possível concluír esta operação, por favor tente mais tarde.');
        }
        if (!doctor) {
            throw new Error('Não existe este douctor!');
        }
        await this.IDoctorsRepository.delete(hospitalId, id);
    }
}
exports.DeleteDoctorsServices = DeleteDoctorsServices;
