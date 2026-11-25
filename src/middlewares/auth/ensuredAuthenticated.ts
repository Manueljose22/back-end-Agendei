import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { AppError } from "../../errors/AppError";
import { prismaClient } from "../../config/prisma/prismaClient";

type JWTPayload = {
    id: string;
    role: AccountRole;
    iat: number;
    exp: number;
    tokenVersion?: number;
};

const validRoles: AccountRole[] = ["platform_admin", "hospital", "doctor", "patient"];

export const ensuredAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;
    const [scheme, token] = authHeader?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
        return next(new AppError("Token de autenticação não fornecido.", 401));
    }

    const secret = process.env.JwtSecret;

    if (!secret) {
        return next(new AppError("Serviço de autenticação não configurado.", 500));
    }

    let payload: JWTPayload;

    try {
        payload = verify(token, secret) as JWTPayload;
    } catch {
        return next(new AppError("Token inválido ou expirado.", 401));
    }

    if (!payload.id || !validRoles.includes(payload.role)) {
        return next(new AppError("Token inválido ou sem perfil de acesso. Inicie sessão novamente.", 401));
    }

    try {
        if (payload.role === "patient") {
            const patient = await prismaClient.patient.findUnique({
                where: { id: payload.id },
                select: { tokenVersion: true, password: true }
            });

            if (!patient || !patient.password || payload.tokenVersion !== patient.tokenVersion) {
                return next(new AppError("Sessão inválida ou revogada. Inicie sessão novamente.", 401));
            }
        }

        request.userId = payload.id;
        request.userRole = payload.role;
        request.isPlatformAdmin = payload.role === "platform_admin";
        if (payload.role === "hospital") request.hospitalId = payload.id;

        return next();
    } catch (error: unknown) {
        return next(error);
    }
};
