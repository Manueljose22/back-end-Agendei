"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseClient = getSupabaseClient;
exports.getSupabaseUser = getSupabaseUser;
const supabase_js_1 = require("@supabase/supabase-js");
let supabaseClient = null;
/** Cria o cliente apenas quando necessário para permitir configuração por ambiente. */
function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("SUPABASE_URL e SUPABASE_ANON_KEY têm de estar configuradas.");
    }
    if (!supabaseClient) {
        supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false,
            },
        });
    }
    return supabaseClient;
}
/** Valida o access token junto do Supabase Auth; não confia apenas no payload JWT. */
async function getSupabaseUser(accessToken) {
    const { data, error } = await getSupabaseClient().auth.getUser(accessToken);
    if (error || !data.user) {
        throw new Error("Token Supabase inválido ou expirado.");
    }
    return data.user;
}
