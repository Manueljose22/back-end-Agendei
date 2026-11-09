"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseAdminClient = getSupabaseAdminClient;
const supabase_js_1 = require("@supabase/supabase-js");
let adminClient = null;
/** Nunca importar este cliente em código executado no Expo ou no frontend. */
function getSupabaseAdminClient() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
        throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias para operações administrativas.");
    }
    if (!adminClient) {
        adminClient = (0, supabase_js_1.createClient)(url, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
        });
    }
    return adminClient;
}
