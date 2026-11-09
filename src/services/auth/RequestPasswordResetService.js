"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestPasswordResetService = void 0;
const supabaseClient_1 = require("../../config/supabase/supabaseClient");
class RequestPasswordResetService {
    async execute(emailInput) {
        const email = emailInput?.trim().toLowerCase();
        if (!email)
            throw new Error("O email é obrigatório.");
        const { error } = await (0, supabaseClient_1.getSupabaseClient)().auth.resetPasswordForEmail(email, {
            redirectTo: process.env.SUPABASE_EMAIL_REDIRECT_URL,
        });
        if (error)
            throw new Error(error.message);
    }
}
exports.RequestPasswordResetService = RequestPasswordResetService;
