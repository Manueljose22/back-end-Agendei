"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const _index_1 = require("./routes/_index");
const prismaClient_1 = require("./config/prisma/prismaClient");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)({
    credentials: true,
    // origin: process.env.ORIGIN_CORS,
    methods: 'GET, PUT, POST, DELETE',
}));
// Fecha conexões ao encerrar servidor
process.on("SIGINT", async () => {
    await prismaClient_1.prismaClient.$disconnect();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await prismaClient_1.prismaClient.$disconnect();
    process.exit(0);
});
app.use(_index_1.routes);
