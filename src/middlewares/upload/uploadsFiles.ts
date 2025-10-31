import path from 'path';
import { supabase } from '../../config/supabaseClient';




export const uploadsFiles = async (files: Express.Multer.File[] | Express.Multer.File): Promise<string | string[]> => {
    
    // garante que "files" sempre seja array internamente
    const filesArray = Array.isArray(files) ? files : [files];

    const imgUrls: string[] = [];

    for (const file of filesArray) {
        const fileName = `${Date.now()}${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`;
        const filePath = `images/${fileName}`;

        const { error } = await supabase.storage.from("uploads").upload(filePath, file.buffer, {
            contentType: file.mimetype,
        });

        if (error) {
            console.error("Erro ao fazer upload:", error.message);
            continue;
        }

        const { publicUrl } = supabase.storage.from("uploads").getPublicUrl(filePath).data;
        imgUrls.push(publicUrl);
    }

    // se for apenas uma imagem retorna string, senão array
    return imgUrls.length === 1 ? imgUrls[0] : imgUrls;
};
