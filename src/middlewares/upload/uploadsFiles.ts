import { randomUUID } from "crypto";
import { getSupabaseStorageClient } from "../../config/storage/supabaseStorage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

export type UploadedFile = {
    url: string;
    path: string;
};

export const uploadFilesWithPaths = async (
    files: Express.Multer.File[] | Express.Multer.File
): Promise<UploadedFile[]> => {
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
    const uploadedFiles: UploadedFile[] = [];

    try {
        for (const file of filesArray) {
            const extension = allowedMimeTypes[file.mimetype];
            const path = `images/${randomUUID()}.${extension}`;

            const { error } = await supabase.storage.from(bucket).upload(path, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false,
            });

            if (error) {
                throw new Error(`Falha ao enviar imagem para o Supabase Storage: ${error.message}`);
            }

            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            uploadedFiles.push({ url: data.publicUrl, path });
        }
    } catch (error) {
        const paths = uploadedFiles.map(file => file.path);

        if (paths.length > 0) {
            await supabase.storage.from(bucket).remove(paths);
        }

        throw error;
    }

    return uploadedFiles;
};

// Mantém a assinatura antiga para não quebrar os controllers que ainda esperam URLs.
export const uploadsFiles = async (
    files: Express.Multer.File[] | Express.Multer.File
): Promise<string | string[]> => {
    const uploadedFiles = await uploadFilesWithPaths(files);
    const urls = uploadedFiles.map(file => file.url);

    return urls.length === 1 ? urls[0] : urls;
};

export const removeStorageFiles = async (paths: string[]): Promise<void> => {
    if (paths.length === 0) return;

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
    const { error } = await getSupabaseStorageClient().storage.from(bucket).remove(paths);

    if (error) {
        throw new Error(`Falha ao remover imagem do Supabase Storage: ${error.message}`);
    }
};

export const getStoragePathFromPublicUrl = (publicUrl: string | null): string | null => {
    if (!publicUrl) return null;

    try {
        const url = new URL(publicUrl);
        const supabaseUrl = process.env.SUPABASE_URL;

        if (!supabaseUrl || url.origin !== new URL(supabaseUrl).origin) {
            return null;
        }

        const bucket = process.env.SUPABASE_STORAGE_BUCKET || "uploads";
        const marker = `/storage/v1/object/public/${bucket}/`;

        if (!url.pathname.startsWith(marker)) {
            return null;
        }

        return decodeURIComponent(url.pathname.slice(marker.length)) || null;
    } catch {
        return null;
    }
};
