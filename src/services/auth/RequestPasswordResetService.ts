import { getSupabaseClient } from "../../config/supabase/supabaseClient";

export class RequestPasswordResetService {
    async execute(emailInput: string): Promise<void> {
        const email = emailInput?.trim().toLowerCase();
        if (!email) throw new Error("O email é obrigatório.");

        const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
            redirectTo: process.env.SUPABASE_EMAIL_REDIRECT_URL,
        });
        if (error) throw new Error(error.message);
    }
}
