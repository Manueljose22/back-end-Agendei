import { Request, Response } from "express";
import { AuthRepository } from "../../repositories/auth/AuthRepository";
import { RegisterPatientAuthService } from "../../services/auth/RegisterPatientAuthService";
import { LoginAuthService } from "../../services/auth/LoginAuthService";
import { RequestPasswordResetService } from "../../services/auth/RequestPasswordResetService";

class AuthControllers {
    async registerPatient(request: Request, response: Response) {
        try {
            const service = new RegisterPatientAuthService(new AuthRepository());
            const result = await service.execute(request.body);
            return response.status(201).json(result);
        } catch (error) {
            return response.status(400).json({ message: error instanceof Error ? error.message : "Não foi possível criar a conta." });
        }
    }

    async login(request: Request, response: Response) {
        try {
            const { email, password } = request.body;
            const service = new LoginAuthService(new AuthRepository());
            const result = await service.execute(email, password);
            return response.status(200).json(result);
        } catch (error) {
            return response.status(401).json({ message: error instanceof Error ? error.message : "Não foi possível iniciar sessão." });
        }
    }

    async me(request: Request, response: Response) {
        return response.status(200).json({ profileId: request.userId });
    }

    async requestPasswordReset(request: Request, response: Response) {
        try {
            const service = new RequestPasswordResetService();
            await service.execute(request.body.email);
            return response.status(200).json({ message: "Se o endereço estiver registado, receberás instruções para recuperar a palavra-passe." });
        } catch (error) {
            return response.status(400).json({ message: error instanceof Error ? error.message : "Não foi possível solicitar a recuperação." });
        }
    }
}

export default new AuthControllers();
