import express from 'express';
import 'express-async-errors'; // Importante para capturar erros do Prisma
import swaggerUi from 'swagger-ui-express';
import { router } from './routes'; // Verifique se o caminho está correto
import swaggerFile from '../../../docs/swagger.json';
import cors from "cors";
import { errorHandler } from './middlewares/errorHandler';

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

// Tratamento global de erros — DEVE ser o último middleware registrado
app.use(errorHandler);

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
  console.log(`📖 Swagger docs available on http://localhost:${port}/api-docs`);
});