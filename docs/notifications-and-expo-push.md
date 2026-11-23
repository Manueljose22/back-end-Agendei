# Notificações internas e Expo Push

## Arquitectura

- A tabela `notifications` continua a ser a fonte de verdade da caixa de entrada.
- Um trigger PostgreSQL cria um registo em `notification_push_jobs` na mesma transacção de cada notificação.
- O worker processa a outbox em segundo plano e envia os avisos através da Expo Push API.
- Falhas transitórias são repetidas até cinco tentativas, com backoff exponencial.
- Tokens que a Expo reportar como `DeviceNotRegistered` são removidos automaticamente.
- O worker usa `FOR UPDATE SKIP LOCKED`, permitindo mais de uma instância do backend sem reclamar simultaneamente o mesmo job.

O envio push é assíncrono e nunca é executado dentro da transacção que cria/confirma/cancela/reagenda a consulta. Uma indisponibilidade da Expo não reverte a operação clínica nem elimina a notificação interna.

A entrega é do tipo *at-least-once*: em falhas de rede depois de a Expo aceitar uma mensagem, pode ocorrer uma repetição. A aplicação móvel deve tratar `notificationId` como identificador estável para evitar processar a mesma navegação/acção mais de uma vez.

## Registar um dispositivo

O utilizador deve obter o Expo Push Token na aplicação móvel (com permissões de notificações concedidas) e enviá-lo autenticado ao backend.

```http
PUT /notifications/push-token
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

Disponível para os perfis `patient`, `doctor` e `hospital`. Cada conta pode registar vários dispositivos. O token é associado ao utilizador autenticado; o cliente não envia IDs de paciente, médico ou hospital.

## Remover um dispositivo

Executar no logout ou quando o utilizador desactivar notificações:

```http
DELETE /notifications/push-token
Authorization: Bearer <JWT>
Content-Type: application/json
```

```json
{
  "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

A remoção é limitada ao token e à conta autenticada.

## Configuração do servidor

- `EXPO_ACCESS_TOKEN` é opcional. Configurar como segredo no ambiente de produção apenas se a aplicação Expo tiver push security activada.
- O backend usa a Expo Push API em `https://exp.host/--/api/v2/push/send`.
- O runtime deve permitir HTTPS de saída para `exp.host`.

## Deploy da migration

Antes de publicar a versão do backend que inicia o worker:

1. Fazer pull da branch.
2. Executar `npx prisma migrate deploy` para criar `expo_push_tokens`, `notification_push_jobs` e o trigger.
3. Executar `npm run build`.
4. Publicar/reiniciar o backend.

O worker só processa notificações criadas depois da instalação do trigger. As notificações antigas continuam disponíveis na caixa de entrada, mas não geram push retroactivo.

## Estados da outbox

- `PENDING`: aguarda envio.
- `PROCESSING`: reclamado por uma instância do worker.
- `RETRY`: falhou temporariamente e aguarda nova tentativa.
- `SENT`: Expo aceitou os tickets.
- `SKIPPED`: destinatário ainda não registou token ou a notificação já não existe.
- `FAILED`: esgotou cinco tentativas; consultar `last_error`.

Um ticket `ok` significa que a Expo aceitou a mensagem para entrega, não que o sistema operativo já a apresentou ao utilizador. A apresentação depende das permissões, configuração do dispositivo e estado da aplicação.
