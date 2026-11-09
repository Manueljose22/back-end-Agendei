"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionServices = void 0;
const bcrypt_1 = require("bcrypt");
const create_users_token_1 = require("../../middlewares/auth/create-users-token");
class SessionServices {
    sessionRepository;
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async execute({ email, password }) {
        const user = await this.sessionRepository.findByEmail(email);
        if (!user || !user.password || !(await (0, bcrypt_1.compare)(password, user.password))) {
            throw new Error("Credenciais inválidas!");
        }
        const token = await (0, create_users_token_1.createUsersToken)(user);
        return {
            user: { ...user, password: "" },
            token,
        };
    }
}
exports.SessionServices = SessionServices;
