import "dotenv/config";
import { getSupabaseAdminClient } from "../src/config/supabase/supabaseAdminClient";
import { prismaClient } from "../src/config/prisma/prismaClient";

async function bootstrapAdmin() {
    const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

    if (!name || !email || !password || password.length < 8) {
        throw new Error("Defina BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL e BOOTSTRAP_ADMIN_PASSWORD (mínimo 8 caracteres).");
    }

    const existing = await prismaClient.admin.findUnique({ where: { email } });
    if (existing) throw new Error("Já existe um administrador com este email.");

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: "admin" },
    });

    if (error) throw error;
    if (!data.user) throw new Error("O Supabase não devolveu o utilizador criado.");

    try {
        await prismaClient.$transaction(async (tx) => {
            const admin = await tx.admin.create({
                data: { name, email },
                select: { id: true },
            });
            await tx.authProfile.create({
                data: {
                    authUserId: data.user.id,
                    role: "admin",
                    profileId: admin.id,
                },
            });
        });
        process.stdout.write("Administrador criado e associado ao Supabase Auth.\n");
    } catch (error) {
        const { error: rollbackError } = await supabase.auth.admin.deleteUser(data.user.id);
        if (rollbackError) {
            process.stderr.write("Falha ao remover o utilizador Supabase após erro na criação do perfil. Verifique manualmente o Auth.\n");
        }
        throw error;
    }
}

bootstrapAdmin()
    .catch((error: unknown) => {
        process.stderr.write(`${error instanceof Error ? error.message : "Erro ao criar administrador."}\n`);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });
