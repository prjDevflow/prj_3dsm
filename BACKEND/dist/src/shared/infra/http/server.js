"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors"); // Importante para capturar erros do Prisma
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes"); // Verifique se o caminho está correto
const swagger_json_1 = __importDefault(require("../../../docs/swagger.json"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
// Documentação
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Rotas - LINHA 17
app.use(routes_1.router);
app.listen(3333, () => {
    console.log("🚀 Server started on http://localhost:3333");
    console.log("📖 Swagger docs available on http://localhost:3333/api-docs");
});
