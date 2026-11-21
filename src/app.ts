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

app.use(express.json());
app.use(express.static('public'));

app.use(cors({
    credentials: true,
    // origin: process.env.ORIGIN_CORS,
    methods: 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
}));

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
