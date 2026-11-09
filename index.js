"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
app_1.app.listen(process.env.PORT, () => {
    try {
        console.log(`Servidor rodando na porta: ${process.env.PORT}`);
    }
    catch (error) {
        console.log(error.message);
    }
});
