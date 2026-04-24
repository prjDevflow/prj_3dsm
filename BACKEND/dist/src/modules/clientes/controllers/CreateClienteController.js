"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClienteController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CreateClienteController {
    async handle(req, res) {
        const { nome, email, telefone } = req.body;
        const clienteExiste = await prisma.cliente.findUnique({ where: { email_cliente: email } });
        if (clienteExiste) {
            return res.status(400).json({ error: "Já existe um cliente com este e-mail." });
        }
        const cliente = await prisma.cliente.create({
            data: {
                nome_cliente: nome,
                email_cliente: email,
                telefone_cliente: telefone
            }
        });
        return res.status(201).json(cliente);
    }
}
exports.CreateClienteController = CreateClienteController;
