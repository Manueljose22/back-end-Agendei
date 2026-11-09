import { getSupabaseClient } from "../../config/supabase/supabaseClient";
import { IAuthRepository } from "../../repositories/auth/IAuthRepository";

export class LoginAuthService {
    constructor(private authRepository: IAuthRepository) {}

    async execute(emailInput: string, password: string) {
        const email = emailInput?.trim().toLowerCase();
        if (!email || !password) {
            throw new Error("Email e palavra-passe são obrigatórios.");
        }

        const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
        if (error || !data.user || !data.session) {
            throw new Error(error?.message || "Não foi possível iniciar sessão.");
        }

        const profile = await this.authRepository.findProfileByAuthUserId(data.user.id);
        if (!profile) {
            await getSupabaseClient().auth.signOut();
            throw new Error("A conta ainda não está associada a um perfil Agendei. Contacta o administrador.");
        }

        return {
            user: { id: data.user.id, email: data.user.email, role: profile.role, profileId: profile.profileId },
            session: data.session,
        };
    }
}
