import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

/** Nunca importar este cliente em código executado no Expo ou no frontend. */
export function getSupabaseAdminClient(): SupabaseClient {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias para operações administrativas.");
    }

    if (!adminClient) {
        adminClient = createClient(url, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
        });
    }

    return adminClient;
}
