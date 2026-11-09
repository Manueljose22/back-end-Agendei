import "dotenv/config";
import { hash } from "bcrypt";
import { prismaClient } from "../src/config/prisma/prismaClient";

async function bootstrapAdmin() {
    const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
    const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

    if (!name || !email || !password || password.length < 12) {
        throw new Error("Defina BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL e BOOTSTRAP_ADMIN_PASSWORD (mínimo 12 caracteres).");
    }

    const existing = await prismaClient.admin.findUnique({ where: { email } });
    if (existing) throw new Error("Já existe um administrador com este email.");

    const passwordHash = await hash(password, 12);
    await prismaClient.admin.create({ data: { name, email, passwordHash } });
    process.stdout.write("Administrador criado com autenticação própria do backend.\n");
}

bootstrapAdmin()
    .catch((error: unknown) => {
        process.stderr.write(`${error instanceof Error ? error.message : "Erro ao criar administrador."}\n`);
        process.exitCode = 1;
    })
    .finally(async () => prismaClient.$disconnect());
