"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePatientsServices = void 0;
const bcrypt_1 = require("bcrypt");
class UpdatePatientsServices {
    IPatientsRepository;
    constructor(IPatientsRepository) {
        this.IPatientsRepository = IPatientsRepository;
    }
    async execute(id, { name, email, password, address, dateBirth, gender, phone, photo, pushToken }) {
        const patient = await this.IPatientsRepository.findById(id);
        if (!patient) {
            throw new Error('usuário inválido!');
        }
        if (password) {
            password = await (0, bcrypt_1.hash)(password, 12);
        }
        const data = {
            name: name ?? patient.name,
            email: email ?? patient.email,
            password: password ?? patient.password,
            phone: phone ?? patient.phone,
            dateBirth: dateBirth ?? patient.dateBirth,
            address: address ?? patient.address,
            gender: gender ?? patient.gender,
            photo: photo ?? patient.photo,
            pushToken: pushToken ?? patient.pushToken
        };
        await this.IPatientsRepository.update(id, data);
    }
}
exports.UpdatePatientsServices = UpdatePatientsServices;
