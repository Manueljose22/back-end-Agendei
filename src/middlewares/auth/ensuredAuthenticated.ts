import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

type JWTPayload = {
    id: string;
    iat: number;
    exp: number;
};

export const ensuredAuthenticated = (request: Request, response: Response, next: NextFunction) => {
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
        const payload = verify(token, secret) as JWTPayload;

        if (!payload.id) {
            return response.status(401).json({ message: "Token inválido." });
        }

        request.userId = payload.id;
        return next();
    } catch {
        return response.status(401).json({ message: "Token inválido ou expirado." });
    }
};