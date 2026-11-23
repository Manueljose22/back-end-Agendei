import { app } from "./src/app";
import { notificationPushWorker } from "./src/services/notifications/NotificationPushWorker";

notificationPushWorker.start();

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta: ${process.env.PORT}`);
});
