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

## Endpoints iniciais disponíveis

O backend disponibiliza nesta fase:

- `POST /auth/patients/register` — cria a identidade no Supabase Auth e o perfil de paciente no PostgreSQL.
- `POST /auth/login` — inicia sessão através do Supabase e devolve a sessão/token e o perfil associado.
- `POST /auth/password/reset` — solicita o envio do email de recuperação.
- `GET /auth/me` — valida o access token Supabase e devolve o ID do perfil Agendei associado.

Exemplo de registo:

```json
{
  "name": "Nome do paciente",
  "email": "paciente@example.com",
  "password": "uma-palavra-passe-segura",
  "phone": "+244900000000"
}
```

O UUID do utilizador Supabase é usado como ID do registo Patient e como chave da relação em `auth_profiles`. A confirmação do endereço de email é controlada pelo Supabase Auth; o cliente Expo deve tratar o deep link de retorno e só considerar a conta confirmada depois da sessão/identidade ser validada.

## Limites desta fase

A integração ainda não substitui o JWT próprio nas rotas antigas. O middleware Supabase foi criado, mas não foi aplicado globalmente para evitar quebrar os clientes actuais antes de migrar todos os tipos de conta. O registo implementado nesta etapa é apenas para pacientes. Médicos, hospitais e administradores precisam de um fluxo de provisionamento próprio; a criação de administradores nunca deve ser pública.

Antes de produção, testar registo com confirmação activada, confirmação por deep link, login antes/depois da confirmação, recuperação de palavra-passe, falha de criação de perfil e concorrência de registos. Não aplicar migrations no projecto remoto antes de rever o SQL e confirmar a ligação ao projecto correcto.
