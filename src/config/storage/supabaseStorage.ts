import { createClient, SupabaseClient } from "@supabase/supabase-js";

let storageClient: SupabaseClient | null = null;

export const getSupabaseStorageClient = (): SupabaseClient => {
    if (storageClient) return storageClient;

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("As variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias para utilizar o Supabase Storage.");
    }

    storageClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    });

    return storageClient;
};
