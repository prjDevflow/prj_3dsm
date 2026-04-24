"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrigemController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CreateOrigemController {
    async handle(req, res) {
        const { nome } = req.body;
        const origemExiste = await prisma.origem.findUnique({ where: { nome_origem: nome } });
        if (origemExiste) {
            return res.status(400).json({ error: "Origem já cadastrada." });
        }
        const origem = await prisma.origem.create({
            data: { nome_origem: nome }
        });
        return res.status(201).json(origem);
    }
}
exports.CreateOrigemController = CreateOrigemController;
