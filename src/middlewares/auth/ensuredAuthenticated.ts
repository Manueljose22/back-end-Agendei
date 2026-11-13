import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";

type JWTPayload = {
    id: string;
    role: AccountRole;
    iat: number;
    exp: number;
};

const validRoles: AccountRole[] = ["platform_admin", "hospital", "doctor", "patient"];

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

        if (!payload.id || !validRoles.includes(payload.role)) {
            return response.status(401).json({
                message: "Token inválido ou sem perfil de acesso. Inicie sessão novamente."
            });
        }

        request.userId = payload.id;
        request.userRole = payload.role;
        request.isPlatformAdmin = payload.role === "platform_admin";
        if (payload.role === "hospital") request.hospitalId = payload.id;

        return next();
    } catch {
        return response.status(401).json({ message: "Token inválido ou expirado." });
    }
};
