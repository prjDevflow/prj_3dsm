import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { routes } from './routes/index'; 

const app = express();

// Leitura manual para evitar erro de Import Attributes do TS 6.0
const swaggerPath = join(process.cwd(), 'src', 'docs', 'swagger.json');
const swaggerConfig = JSON.parse(readFileSync(swaggerPath, 'utf8'));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerConfig));
app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) return res.status(400).json({ error: err.message });
  return res.status(500).json({ status: "error", message: "Internal server error" });
});

app.listen(process.env.PORT || 3001, () => console.log(`ABP Online!`));