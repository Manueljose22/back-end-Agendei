-- O administrador mantém apenas dados de perfil; credenciais pertencem ao Supabase Auth.
CREATE TABLE "Admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Admins_email_key" ON "Admins"("email");
