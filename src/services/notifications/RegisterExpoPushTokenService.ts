import { AppError } from "../../errors/AppError";
import { AccountRole } from "../../repositories/sessions/ISessionsRepository";
import { ExpoPushTokensRepository } from "../../repositories/notifications/ExpoPushTokensRepository";

const expoTokenPattern = /^(Expo|Exponent)PushToken\[[A-Za-z0-9_-]+\]$/;

export class RegisterExpoPushTokenService {
    constructor(private readonly repository: ExpoPushTokensRepository) {}

    async register(token: unknown, userId: string, role: AccountRole): Promise<void> {
        if (role !== "patient" && role !== "doctor" && role !== "hospital") {
            throw new AppError("Este perfil não pode registar dispositivos para notificações.", 403);
        }
        if (typeof token !== "string" || token.length > 200 || !expoTokenPattern.test(token)) {
            throw new AppError("Token Expo Push inválido.", 400);
        }
        await this.repository.register(token, { userId, role });
    }

    async remove(token: unknown, userId: string, role: AccountRole): Promise<void> {
        if (role !== "patient" && role !== "doctor" && role !== "hospital") {
            throw new AppError("Este perfil não pode gerir dispositivos para notificações.", 403);
        }
        if (typeof token !== "string" || token.length > 200 || !expoTokenPattern.test(token)) {
            throw new AppError("Token Expo Push inválido.", 400);
        }
        await this.repository.remove(token, { userId, role });
    }
}
