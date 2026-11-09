# PostgreSQL e Supabase Auth — Agendei

## Base de dados
O Prisma passa a usar PostgreSQL. A migration inicial cria uma base vazia e não importa dados MySQL. Configure DATABASE_URL com a connection string PostgreSQL do projecto Supabase ou de outro fornecedor PostgreSQL.

Comandos após configurar a base:
```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run typecheck
npm run build
```
Em desenvolvimento, use `npx prisma migrate dev` numa base descartável.

## Supabase Auth
- Supabase Auth será a autoridade de identidade, credenciais, confirmação de email, recuperação de palavra-passe e sessões.
- O backend deve validar access tokens com Supabase Auth. Nunca confiar em IDs, emails ou roles enviados no body.
- Perfis de domínio (Patient, Doctor, Hospital) continuam no PostgreSQL via Prisma e devem ser ligados ao UUID do utilizador Auth.
- Activar confirmação de email no painel Supabase e configurar Site URL/Redirect URLs para os esquemas e URLs usados pelo Expo e web.
- Configurar SMTP próprio antes da produção.
- Roles administrativas devem ser atribuídas exclusivamente no servidor, nunca através de user_metadata controlável pelo utilizador.
- A service_role é exclusivamente server-side e nunca pode entrar no bundle mobile/web nem no Git.

## Nota de implementação
A mudança de identidade deve abranger pacientes, médicos e contas hospitalares como uma única estratégia. Não misturar JWTs Supabase e JWTs próprios como solução permanente. A integração dos endpoints de registo/login e provisionamento dos perfis será concluída em conjunto, para não deixar utilizadores registados sem perfil ou contas profissionais sem autenticação consistente.
