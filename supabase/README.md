# Supabase — Agendei

Project reference: `qpxqynerluuzijccgnuc`

Esta pasta contém a configuração do Supabase CLI e migrations específicas do projecto. O PostgreSQL da aplicação continua a ser gerido pelo Prisma; as migrations desta pasta destinam-se a objectos próprios do Supabase, como tabelas auxiliares de autenticação.

## Ligar o projecto

1. Instalar o Supabase CLI localmente.
2. Executar `supabase login` e autenticar no browser.
3. Na raiz do repositório, executar `supabase link --project-ref qpxqynerluuzijccgnuc`.
4. Confirmar no Dashboard que o projecto ligado é o Agendei antes de aplicar qualquer migration.

## Aplicar migrations

Rever primeiro os ficheiros em `supabase/migrations`. Depois de confirmar que o projecto remoto é o correcto, executar:

```bash
supabase db push
```

Não executar este comando contra produção sem rever o SQL e confirmar o estado da base de dados.

## Autenticação por email

No Dashboard: Authentication → Providers → Email, activar confirmação de email. Em Authentication → URL Configuration, configurar o Site URL e os Redirect URLs para os ambientes usados pela aplicação Expo. O redirect de desenvolvimento indicado no `.env.example` é apenas um exemplo e deve corresponder ao scheme real configurado no Expo.

Para produção, configurar SMTP próprio. Não depender do serviço de email de teste do Supabase para utilizadores finais.

## Segredos

- `SUPABASE_URL` e a chave publishable/anon podem ser usadas para inicializar o cliente de autenticação no backend.
- `SUPABASE_SERVICE_ROLE_KEY` é exclusivamente server-side: nunca colocar no Expo, frontend, Git ou mensagens.
- `DATABASE_URL` é a ligação PostgreSQL usada pelo Prisma e deve ficar apenas em variáveis de ambiente.

## Estado da implementação

A configuração do projecto, a tabela de mapeamento de identidades e o cliente Supabase do backend são a fundação inicial. Os endpoints de registo/login, confirmação, recuperação de palavra-passe, associação de perfis existentes e substituição gradual do JWT próprio ainda precisam de ser implementados e testados antes de considerar a migração concluída.
