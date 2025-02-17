import { app } from "./src/app";



app.listen(process.env.PORT, () => {
    try {
        console.log(`Servidor rodando na porta: ${process.env.PORT}`);
    } catch (error: any) {
        console.log(error.message);
    }
})