import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";

export const errorHandler = (
    error: unknown,
    request: Request,
    response: Response,
    _next: NextFunction
) => {
    if (response.headersSent) return _next(error);

    if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            return response.status(409).json({ message: "Já existe um registo com estes dados." });
        }
        if (error.code === "P2025") {
            return response.status(404).json({ message: "O registo solicitado não foi encontrado." });
        }
        if (error.code === "P2003") {
            return response.status(400).json({ message: "Os dados fornecidos referenciam um registo inválido." });
        }
        if (error.code === "P2034") {
            return response.status(409).json({ message: "A operação entrou em conflito com outra alteração. Tente novamente." });
        }
    }

    if (error instanceof SyntaxError && "body" in error) {
        return response.status(400).json({ message: "O corpo do pedido contém JSON inválido." });
    }

    console.error("[API_ERROR]", {
        method: request.method,
        path: request.originalUrl,
        error
    });

    return response.status(500).json({
        message: "Ocorreu um erro interno. Tente novamente mais tarde."
    });
};
