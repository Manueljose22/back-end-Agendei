"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensuredAuthenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const ensuredAuthenticated = (request, response, next) => {
    const authHeader = request.headers.authorization;
    const [scheme, token] = authHeader?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
        return response.status(401).json({ message: "Token de autenticação não fornecido." });
    }
    const secret = process.env.JwtSecret;
    if (!secret) {
        return response.status(500).json({ message: "Serviço de autenticação não configurado." });
    }
    try {
        const payload = (0, jsonwebtoken_1.verify)(token, secret);
        if (!payload.id) {
            return response.status(401).json({ message: "Token inválido." });
        }
        request.userId = payload.id;
        return next();
    }
    catch {
        return response.status(401).json({ message: "Token inválido ou expirado." });
    }
};
exports.ensuredAuthenticated = ensuredAuthenticated;
