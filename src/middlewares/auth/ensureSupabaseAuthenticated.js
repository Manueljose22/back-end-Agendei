"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSupabaseAuthenticated = void 0;
const supabaseClient_1 = require("../../config/supabase/supabaseClient");
const AuthRepository_1 = require("../../repositories/auth/AuthRepository");
const ensureSupabaseAuthenticated = async (request, response, next) => {
    const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
        return response.status(401).json({ message: "Token de autenticação não fornecido." });
    }
    try {
        const user = await (0, supabaseClient_1.getSupabaseUser)(token);
        const profile = await new AuthRepository_1.AuthRepository().findProfileByAuthUserId(user.id);
        if (!profile) {
            return response.status(403).json({ message: "Utilizador sem perfil associado no Agendei." });
        }
        request.userId = profile.profileId;
        request.userRole = profile.role;
        return next();
    }
    catch {
        return response.status(401).json({ message: "Token Supabase inválido ou expirado." });
    }
};
exports.ensureSupabaseAuthenticated = ensureSupabaseAuthenticated;
