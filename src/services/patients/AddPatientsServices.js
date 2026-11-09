"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPatientsServices = void 0;
const bcrypt_1 = require("bcrypt");
const create_users_token_1 = require("../../middlewares/auth/create-users-token");
class AddPatientsServices {
    IPatientsRepository;
    constructor(IPatientsRepository) {
        this.IPatientsRepository = IPatientsRepository;
    }
    async execute({ name, email, password, address, dateBirth, gender, phone, photo, pushToken }) {
        if (email) {
            const patient = await this.IPatientsRepository.findByEmail(email);
            if (patient) {
                throw new Error('Já existe um registro com este nome!');
            }
            if (!name) {
                throw new Error('Preencha o campo nome.');
            }
            else if (!email) {
                throw new Error('Preencha o campo email.');
            }
            else if (!password) {
                throw new Error('Crie uma senha, por favor.');
            }
            const passHash = await (0, bcrypt_1.hash)(password, 12);
            const userCreated = await this.IPatientsRepository.save({ name, email, password: passHash, address, dateBirth, gender, phone, photo, pushToken });
            const token = await (0, create_users_token_1.createUsersToken)(userCreated);
            return {
                user: userCreated,
                token: token
            };
        }
        else {
            if (!name) {
                throw new Error('Preencha o campo nome.');
            }
            password = '123456';
            const passHash = await (0, bcrypt_1.hash)(password, 12);
            const userCreated = await this.IPatientsRepository.save({ name, email, password: passHash, address, dateBirth, gender, phone, photo, pushToken });
            const token = await (0, create_users_token_1.createUsersToken)(userCreated);
            return {
                user: userCreated,
                token: token
            };
        }
    }
}
exports.AddPatientsServices = AddPatientsServices;
