"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SessionsRepository_1 = require("../../repositories/sessions/SessionsRepository");
const SessionServices_1 = require("../../services/session/SessionServices");
class SessionsControllers {
    async handle(request, response) {
        const { email, password } = request.body;
        try {
            const sessionRepository = new SessionsRepository_1.SessionRepository();
            const service = new SessionServices_1.SessionServices(sessionRepository);
            const result = await service.execute({ email, password });
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error.message });
        }
    }
}
exports.default = new SessionsControllers;
