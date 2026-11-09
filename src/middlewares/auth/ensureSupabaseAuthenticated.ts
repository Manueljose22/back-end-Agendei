import { NextFunction, Request, Response } from "express";
import { getSupabaseUser } from "../../config/supabase/supabaseClient";
import { AuthRepository } from "../../repositories/auth/AuthRepository";

export const ensureSupabaseAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
    const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
        return response.status(401).json({ message: "Token de autenticação não fornecido." });
    }

    try {
        const user = await getSupabaseUser(token);
        const profile = await new AuthRepository().findProfileByAuthUserId(user.id);
        if (!profile) {
            return response.status(403).json({ message: "Utilizador sem perfil associado no Agendei." });
        }

        request.userId = profile.profileId;
        return next();
    } catch {
        return response.status(401).json({ message: "Token Supabase inválido ou expirado." });
    }
};
