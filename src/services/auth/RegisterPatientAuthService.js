"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPatientAuthService = void 0;
const supabaseClient_1 = require("../../config/supabase/supabaseClient");
const supabaseAdminClient_1 = require("../../config/supabase/supabaseAdminClient");
class RegisterPatientAuthService {
    authRepository;
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(input) {
        const name = input.name?.trim();
        const email = input.email?.trim().toLowerCase();
        const password = input.password;
        if (!name || !email || !password) {
            throw new Error("Nome, email e palavra-passe são obrigatórios.");
        }
        if (password.length < 8) {
            throw new Error("A palavra-passe deve ter pelo menos 8 caracteres.");
        }
        const supabase = (0, supabaseClient_1.getSupabaseClient)();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: process.env.SUPABASE_EMAIL_REDIRECT_URL,
                data: { name, role: "patient" },
            },
        });
        if (error) {
            throw new Error(error.message);
        }
        if (!data.user) {
            throw new Error("O Supabase não devolveu o utilizador criado.");
        }
        try {
            await this.authRepository.createPatientProfile({
                authUserId: data.user.id,
                name,
                email,
                phone: input.phone ?? null,
            });
        }
        catch (profileError) {
            // Compensação: remove a identidade criada se o serviço administrativo estiver configurado.
            try {
                const admin = (0, supabaseAdminClient_1.getSupabaseAdminClient)();
                await admin.auth.admin.deleteUser(data.user.id);
            }
            catch {
                throw new Error("A conta foi criada no Supabase, mas não foi possível criar o perfil local. Verifica a configuração da base de dados e remove a conta incompleta no Supabase Auth antes de repetir o registo.");
            }
            throw profileError;
        }
        return {
            message: "Conta criada. Confirma o teu endereço de email para poderes iniciar sessão.",
            user: { id: data.user.id, email: data.user.email, emailConfirmed: Boolean(data.user.email_confirmed_at) },
            requiresEmailConfirmation: !data.session,
        };
    }
}
exports.RegisterPatientAuthService = RegisterPatientAuthService;
