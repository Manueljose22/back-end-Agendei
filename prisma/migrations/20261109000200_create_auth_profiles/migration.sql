-- Mapeia identidades do Supabase Auth para perfis internos do Agendei.
-- Esta tabela é gerida pelo Prisma; não duplicar esta migration em supabase/migrations.

CREATE TABLE "auth_profiles" (
    "auth_user_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_profiles_pkey" PRIMARY KEY ("auth_user_id"),
    CONSTRAINT "auth_profiles_role_profile_unique" UNIQUE ("role", "profile_id"),
    CONSTRAINT "auth_profiles_role_check" CHECK ("role" IN ('patient', 'doctor', 'hospital', 'admin'))
);

CREATE INDEX "auth_profiles_role_idx" ON "auth_profiles"("role");

ALTER TABLE "auth_profiles"
ADD CONSTRAINT "auth_profiles_auth_user_id_fkey"
FOREIGN KEY ("auth_user_id") REFERENCES auth.users("id") ON DELETE CASCADE ON UPDATE CASCADE;
