"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLojaController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CreateLojaController {
    async handle(req, res) {
        const { nome } = req.body;
        const loja = await prisma.loja.create({
            data: { nome_loja: nome }
        });
        return res.status(201).json(loja);
    }
}
exports.CreateLojaController = CreateLojaController;
