import { NextFunction, Request, Response } from "express";
import multer from "multer";

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

export const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 5,
    },
    fileFilter: (_request, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new Error("Formato inválido. Envie uma imagem JPEG, PNG ou WebP."));
        }
        return callback(null, true);
    },
});

const handleUploadError = (response: Response, error: unknown): void => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            response.status(413).json({ message: "Cada imagem deve ter no máximo 5 MB." });
            return;
        }
        if (error.code === "LIMIT_FILE_COUNT") {
            response.status(400).json({ message: "Pode enviar no máximo 5 imagens." });
            return;
        }
        response.status(400).json({ message: "Não foi possível processar os ficheiros enviados." });
        return;
    }

    const message = error instanceof Error ? error.message : "Não foi possível processar as imagens.";
    response.status(400).json({ message });
};

export const uploadSingleImage = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    uploadImage.single("photo")(request, response, (error: unknown) => {
        if (error) {
            handleUploadError(response, error);
            return;
        }
        next();
    });
};

export const uploadMultipleImages = (
    request: Request,
    response: Response,
    next: NextFunction
): void => {
    uploadImage.array("images", 5)(request, response, (error: unknown) => {
        if (error) {
            handleUploadError(response, error);
            return;
        }
        next();
    });
};
