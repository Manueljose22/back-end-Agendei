import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

/** Cria o cliente apenas quando necessário para permitir configuração por ambiente. */
export function getSupabaseClient(): SupabaseClient {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("SUPABASE_URL e SUPABASE_ANON_KEY têm de estar configuradas.");
    }

    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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
export async function getSupabaseUser(accessToken: string) {
    const { data, error } = await getSupabaseClient().auth.getUser(accessToken);

    if (error || !data.user) {
        throw new Error("Token Supabase inválido ou expirado.");
    }

    return data.user;
}
