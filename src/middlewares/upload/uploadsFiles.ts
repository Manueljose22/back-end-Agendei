import path from "path";
import { randomUUID } from "crypto";
import { getSupabaseStorageClient } from "../../config/storage/supabaseStorage";

export const uploadsFiles = async (
    files: Express.Multer.File[] | Express.Multer.File
): Promise<string | string[]> => {
    const filesArray = Array.isArray(files) ? files : [files];

    if (filesArray.length === 0) {
        throw new Error("Nenhum ficheiro foi enviado.");
    }

    const supabase = getSupabaseStorageClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    const imageUrls: string[] = [];

    for (const file of filesArray) {
        const extension = path.extname(file.originalname).toLowerCase();
        const filePath = `images/${randomUUID()}${extension}`;

        const { error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
        });

        if (error) {
            throw new Error(`Falha ao enviar imagem para o Supabase Storage: ${error.message}`);
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
    }

    return imageUrls.length === 1 ? imageUrls[0] : imageUrls;
};
