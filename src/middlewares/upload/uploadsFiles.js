"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsFiles = void 0;
const path_1 = __importDefault(require("path"));
const supabaseClient_1 = require("../../config/supabaseClient");
const uploadsFiles = async (files) => {
    // garante que "files" sempre seja array internamente
    const filesArray = Array.isArray(files) ? files : [files];
    const imgUrls = [];
    for (const file of filesArray) {
        const fileName = `${Date.now()}${Math.floor(Math.random() * 1000)}${path_1.default.extname(file.originalname)}`;
        const filePath = `images/${fileName}`;
        const { error } = await supabaseClient_1.supabase.storage.from("uploads").upload(filePath, file.buffer, {
            contentType: file.mimetype,
        });
        if (error) {
            console.error("Erro ao fazer upload:", error.message);
            continue;
        }
        const { publicUrl } = supabaseClient_1.supabase.storage.from("uploads").getPublicUrl(filePath).data;
        imgUrls.push(publicUrl);
    }
    // se for apenas uma imagem retorna string, senão array
    return imgUrls.length === 1 ? imgUrls[0] : imgUrls;
};
exports.uploadsFiles = uploadsFiles;
