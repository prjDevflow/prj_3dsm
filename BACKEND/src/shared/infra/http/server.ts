import express from 'express';
import 'express-async-errors'; // Importante para capturar erros do Prisma
import swaggerUi from 'swagger-ui-express';
import { router } from './routes'; // Verifique se o caminho está correto
import swaggerFile from '../../../docs/swagger.json';
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Documentação
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rotas - LINHA 17
app.use(router); 

app.listen(3333, () => {
  console.log("🚀 Server started on http://localhost:3333");
  console.log("📖 Swagger docs available on http://localhost:3333/api-docs");
});