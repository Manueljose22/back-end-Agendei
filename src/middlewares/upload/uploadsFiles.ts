import { randomUUID } from "crypto";
import { getSupabaseStorageClient } from "../../config/storage/supabaseStorage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

export const uploadsFiles = async (
    files: Express.Multer.File[] | Express.Multer.File
): Promise<string | string[]> => {
    const filesArray = Array.isArray(files) ? files : [files];

    if (filesArray.length === 0) {
        throw new Error("Nenhum ficheiro foi enviado.");
    }

    for (const file of filesArray) {
        if (!file.buffer || file.size === 0) {
            throw new Error("O ficheiro enviado está vazio ou é inválido.");
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error("Cada imagem deve ter no máximo 5 MB.");
        }

        if (!allowedMimeTypes[file.mimetype]) {
            throw new Error("Formato inválido. Envie uma imagem JPEG, PNG ou WebP.");
        }
    }

    const supabase = getSupabaseStorageClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    const uploadedPaths: string[] = [];
    const imageUrls: string[] = [];

    try {
        for (const file of filesArray) {
            const extension = allowedMimeTypes[file.mimetype];
            const filePath = `images/${randomUUID()}.${extension}`;

            const { error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false,
            });

            if (error) {
                throw new Error(`Falha ao enviar imagem para o Supabase Storage: ${error.message}`);
            }

            uploadedPaths.push(filePath);

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            imageUrls.push(data.publicUrl);
        }
    } catch (error) {
        if (uploadedPaths.length > 0) {
            await supabase.storage.from(bucket).remove(uploadedPaths);
        }

        throw error;
    }

    return imageUrls.length === 1 ? imageUrls[0] : imageUrls;
};
