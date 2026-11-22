import express from 'express';
import "reflect-metadata";
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes/_index';
import { prismaClient } from './config/prisma/prismaClient';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './errors/AppError';

dotenv.config();

const app = express();

const allowedOrigins = (process.env.ORIGIN_CORS ?? "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        // Aplicações nativas e chamadas servidor-a-servidor podem não enviar Origin.
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new AppError("Origem não autorizada pelo CORS.", 403));
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.static('public'));

// Fecha conexões ao encerrar servidor
process.on("SIGINT", async () => {
  await prismaClient.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prismaClient.$disconnect();
  process.exit(0);
});

app.use(routes);

// Converte rotas inexistentes em erro tipado antes do handler global.
app.use((request, _response, next) => {
  next(new AppError(`Rota ${request.method} ${request.originalUrl} não encontrada.`, 404));
});

// Deve ser o último middleware, depois de todas as rotas.
app.use(errorHandler);

export { app };
