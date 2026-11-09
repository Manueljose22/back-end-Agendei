"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsersToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createUsersToken = async ({ id, email }) => {
    const secret = process.env.JwtSecret;
    if (!secret) {
        throw new Error("A variável JwtSecret não está configurada.");
    }
    return (0, jsonwebtoken_1.sign)({ id, email }, secret, { expiresIn: "1d" });
};
exports.createUsersToken = createUsersToken;
