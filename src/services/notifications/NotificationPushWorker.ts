import { prismaClient } from "../../config/prisma/prismaClient";

type ClaimedPushJob = {
    id: string;
    notificationId: string;
    attempts: number;
};

type ExpoTicket = {
    status?: "ok" | "error";
    message?: string;
    details?: { error?: string };
};

type ExpoResponse = {
    data?: ExpoTicket | ExpoTicket[];
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const MAX_ATTEMPTS = 5;
const EXPO_BATCH_SIZE = 100;

class NotificationPushWorker {
    private running = false;

    start(): void {
        const run = () => {
            if (this.running) return;
            this.running = true;
            void this.processBatch()
                .catch(error => console.error("[Expo Push] Worker error:", error))
                .finally(() => { this.running = false; });
        };

        setTimeout(run, 1500);
        setInterval(run, 5000);
    }

    private async claimJob(): Promise<ClaimedPushJob | null> {
        const claimed = await prismaClient.$transaction(tx => tx.$queryRaw<ClaimedPushJob[]>`
            WITH candidate AS (
                SELECT "id"
                FROM "public"."notification_push_jobs"
                WHERE (
                    ("status" IN ('PENDING', 'RETRY') AND "next_attempt_at" <= NOW())
                    OR ("status" = 'PROCESSING' AND "locked_at" < NOW() - INTERVAL '2 minutes')
                )
                ORDER BY "created_at" ASC
                FOR UPDATE SKIP LOCKED
                LIMIT 1
            )
            UPDATE "public"."notification_push_jobs" AS job
            SET "status" = 'PROCESSING', "locked_at" = NOW(), "updated_at" = NOW()
            FROM candidate
            WHERE job."id" = candidate."id"
            RETURNING job."id", job."notification_id" AS "notificationId", job."attempts"
        `);
        return claimed[0] ?? null;
    }

    private async processBatch(): Promise<void> {
        for (let index = 0; index < 20; index++) {
            const job = await this.claimJob();
            if (!job) return;
            await this.processJob(job);
        }
    }

    private async processJob(job: ClaimedPushJob): Promise<void> {
        try {
            const notification = await prismaClient.notification.findUnique({
                where: { id: job.notificationId },
                select: {
                    id: true, title: true, message: true, type: true, data: true,
                    appointmentId: true, recipientRole: true,
                    patientId: true, doctorId: true, hospitalId: true
                }
            });

            if (!notification) {
                await this.finish(job.id, "SKIPPED", "Notificação já não existe.");
                return;
            }

            const tokenWhere = notification.recipientRole === "PATIENT"
                ? { patientId: notification.patientId, recipientRole: "PATIENT" as const }
                : notification.recipientRole === "DOCTOR"
                    ? { doctorId: notification.doctorId, recipientRole: "DOCTOR" as const }
                    : { hospitalId: notification.hospitalId, recipientRole: "HOSPITAL" as const };

            const tokens = await prismaClient.expoPushToken.findMany({
                where: tokenWhere,
                select: { id: true, token: true }
            });

            if (tokens.length === 0) {
                await this.finish(job.id, "SKIPPED", "Destinatário ainda não registou um dispositivo Expo.");
                return;
            }

            const rawData = notification.data;
            const extraData = rawData && typeof rawData === "object" && !Array.isArray(rawData)
                ? rawData as Record<string, unknown>
                : {};
            const headers: Record<string, string> = {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json"
            };
            if (process.env.EXPO_ACCESS_TOKEN) {
                headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
            }

            const failures: string[] = [];
            let invalidTokens = 0;

            for (let offset = 0; offset < tokens.length; offset += EXPO_BATCH_SIZE) {
                const chunk = tokens.slice(offset, offset + EXPO_BATCH_SIZE);
                const messages = chunk.map(item => ({
                    to: item.token,
                    sound: "default",
                    title: notification.title,
                    body: notification.message,
                    data: {
                        ...extraData,
                        notificationId: notification.id,
                        type: notification.type,
                        appointmentId: notification.appointmentId
                    }
                }));

                const response = await fetch(EXPO_PUSH_URL, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(messages),
                    signal: AbortSignal.timeout(10000)
                });

                if (!response.ok) {
                    throw new Error(`Expo Push respondeu HTTP ${response.status}.`);
                }

                const payload = await response.json() as ExpoResponse;
                const tickets = Array.isArray(payload.data) ? payload.data : payload.data ? [payload.data] : [];
                if (tickets.length !== chunk.length) {
                    throw new Error("Resposta do Expo Push incompleta.");
                }

                for (let index = 0; index < tickets.length; index++) {
                    const ticket = tickets[index];
                    if (ticket.status === "ok") continue;

                    if (ticket.details?.error === "DeviceNotRegistered") {
                        invalidTokens++;
                        await prismaClient.expoPushToken.deleteMany({ where: { id: chunk[index].id } });
                        continue;
                    }

                    failures.push(ticket.message ?? ticket.details?.error ?? "Falha desconhecida no Expo Push.");
                }
            }

            if (failures.length > 0) {
                throw new Error(failures.join("; ").slice(0, 1000));
            }

            if (invalidTokens === tokens.length) {
                await this.finish(job.id, "SKIPPED", "A Expo indicou que todos os dispositivos já não estão registados.");
                return;
            }

            await this.finish(job.id, "SENT", null);
        } catch (error) {
            const attempts = job.attempts + 1;
            const status = attempts >= MAX_ATTEMPTS ? "FAILED" : "RETRY";
            const delaySeconds = Math.min(3600, 5 * (2 ** (attempts - 1)));
            await prismaClient.notificationPushJob.update({
                where: { id: job.id },
                data: {
                    status,
                    attempts,
                    nextAttemptAt: new Date(Date.now() + delaySeconds * 1000),
                    lockedAt: null,
                    lastError: (error instanceof Error ? error.message : "Erro desconhecido").slice(0, 1000)
                }
            });
        }
    }

    private async finish(id: string, status: "SENT" | "SKIPPED", lastError: string | null): Promise<void> {
        await prismaClient.notificationPushJob.update({
            where: { id },
            data: { status, sentAt: status === "SENT" ? new Date() : null, lockedAt: null, lastError }
        });
    }
}

export const notificationPushWorker = new NotificationPushWorker();
