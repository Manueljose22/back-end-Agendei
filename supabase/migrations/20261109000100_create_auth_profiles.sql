-- Liga identidades do Supabase Auth aos perfis de domínio do Agendei.
-- A tabela é gerida pelo backend; não disponibilizar escrita directa ao cliente.

create table if not exists public.auth_profiles (
  auth_user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('patient', 'doctor', 'hospital', 'admin')),
  profile_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint auth_profiles_role_profile_unique unique (role, profile_id)
);

create index if not exists auth_profiles_role_idx
  on public.auth_profiles (role);

alter table public.auth_profiles enable row level security;

comment on table public.auth_profiles is
  'Mapeia utilizadores autenticados pelo Supabase para perfis internos do Agendei. Acesso apenas pelo backend.';
