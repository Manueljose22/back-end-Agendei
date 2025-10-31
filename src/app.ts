import express from 'express';
import "reflect-metadata";
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes/_index';
import { prismaClient } from './config/prisma/prismaClient';


dotenv.config();

const app = express();


app.use(express.json());
app.use(express.static('public'));


app.use(cors({
    credentials: true,
    // origin: process.env.ORIGIN_CORS,
    methods: 'GET, PUT, POST, DELETE',
}))


// Fecha conexões ao encerrar servidor
process.on("SIGINT", async () => {
  await prismaClient.$disconnect()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  await prismaClient.$disconnect()
  process.exit(0)
})


app.use(routes);


export { app }