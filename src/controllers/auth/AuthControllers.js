"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthRepository_1 = require("../../repositories/auth/AuthRepository");
const RegisterPatientAuthService_1 = require("../../services/auth/RegisterPatientAuthService");
const LoginAuthService_1 = require("../../services/auth/LoginAuthService");
const RequestPasswordResetService_1 = require("../../services/auth/RequestPasswordResetService");
class AuthControllers {
    async registerPatient(request, response) {
        try {
            const service = new RegisterPatientAuthService_1.RegisterPatientAuthService(new AuthRepository_1.AuthRepository());
            const result = await service.execute(request.body);
            return response.status(201).json(result);
        }
        catch (error) {
            return response.status(400).json({ message: error instanceof Error ? error.message : "Não foi possível criar a conta." });
        }
    }
    async login(request, response) {
        try {
            const { email, password } = request.body;
            const service = new LoginAuthService_1.LoginAuthService(new AuthRepository_1.AuthRepository());
            const result = await service.execute(email, password);
            return response.status(200).json(result);
        }
        catch (error) {
            return response.status(401).json({ message: error instanceof Error ? error.message : "Não foi possível iniciar sessão." });
        }
    }
    async me(request, response) {
        return response.status(200).json({ profileId: request.userId });
    }
    async requestPasswordReset(request, response) {
        try {
            const service = new RequestPasswordResetService_1.RequestPasswordResetService();
            await service.execute(request.body.email);
            return response.status(200).json({ message: "Se o endereço estiver registado, receberás instruções para recuperar a palavra-passe." });
        }
        catch (error) {
            return response.status(400).json({ message: error instanceof Error ? error.message : "Não foi possível solicitar a recuperação." });
        }
    }
}
exports.default = new AuthControllers();
