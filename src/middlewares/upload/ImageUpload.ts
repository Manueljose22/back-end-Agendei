import { NextFunction, Request, Response } from "express";
import multer from "multer";

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

// Mantém o middleware Multer exportado para as rotas que precisam de uploads.
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

// Wrapper para devolver erros do Multer como respostas 4xx, em vez de erros internos 500.
export const uploadSingleImage = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    uploadImage.single("photo")(request, response, (error: unknown) => {
        if (!error) {
            next();
            return;
        }

        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                response.status(413).json({ message: "A imagem deve ter no máximo 5 MB." });
                return;
            }

            response.status(400).json({ message: "Não foi possível processar o ficheiro enviado." });
            return;
        }

        const message = error instanceof Error
            ? error.message
            : "Não foi possível processar a imagem.";

        response.status(400).json({ message });
    });
};
