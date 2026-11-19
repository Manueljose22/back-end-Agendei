import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { AppError } from "../../errors/AppError";

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
        return next(new AppError("Token de autenticação não fornecido.", 401));
    }

    const secret = process.env.JwtSecret;

    if (!secret) {
        return next(new AppError("Serviço de autenticação não configurado.", 500));
    }

    try {
        const payload = verify(token, secret) as JWTPayload;

        if (!payload.id || !validRoles.includes(payload.role)) {
            return next(new AppError("Token inválido ou sem perfil de acesso. Inicie sessão novamente.", 401));
        }

        request.userId = payload.id;
        request.userRole = payload.role;
        request.isPlatformAdmin = payload.role === "platform_admin";
        if (payload.role === "hospital") request.hospitalId = payload.id;

        return next();
    } catch {
        return next(new AppError("Token inválido ou expirado.", 401));
    }
};
