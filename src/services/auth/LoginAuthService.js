"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAuthService = void 0;
const supabaseClient_1 = require("../../config/supabase/supabaseClient");
class LoginAuthService {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(emailInput, password) {
        const email = emailInput?.trim().toLowerCase();
        if (!email || !password) {
            throw new Error("Email e palavra-passe são obrigatórios.");
        }
        const { data, error } = await (0, supabaseClient_1.getSupabaseClient)().auth.signInWithPassword({ email, password });
        if (error || !data.user || !data.session) {
            throw new Error(error?.message || "Não foi possível iniciar sessão.");
        }
        const profile = await this.authRepository.findProfileByAuthUserId(data.user.id);
        if (!profile) {
            throw new Error("A conta ainda não está associada a um perfil Agendei. Contacta o administrador.");
        }
        return {
            user: { id: data.user.id, email: data.user.email, role: profile.role, profileId: profile.profileId },
            session: data.session,
        };
    }
}
exports.LoginAuthService = LoginAuthService;
