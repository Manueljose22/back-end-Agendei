import { NextFunction, Request, Response } from "express";
import multer from "multer";

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

// Mantém o middleware Multer exportado para as rotas de pacientes e hospitais.
export const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB por ficheiro
        files: 5,
    },
    fileFilter: (_request, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new Error("Formato inválido. Envie uma imagem JPEG, PNG ou WebP."));
        }

        return callback(null, true);
    },
});

// Wrapper para devolver erros de upload como JSON no cadastro de médicos.
export const uploadSingleImage = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    uploadImage.single("photo")(request, response, (error: unknown) => {
        if (error) {
            const message = error instanceof Error ? error.message : "Não foi possível processar a imagem.";
            response.status(400).json({ message });
            return;
        }

        next();
    });
};
