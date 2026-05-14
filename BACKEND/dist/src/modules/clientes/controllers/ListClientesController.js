"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListClientesController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ListClientesController {
    async handle(req, res) {
        const { search, page = '1', limit = '20' } = req.query;
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const skip = (pageNum - 1) * limitNum;
        const where = search
            ? {
                OR: [
                    { nome_cliente: { contains: search, mode: 'insensitive' } },
                    { email_cliente: { contains: search, mode: 'insensitive' } },
                    { telefone_cliente: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [clientes, total] = await Promise.all([
            prisma.cliente.findMany({ where, skip, take: limitNum, orderBy: { nome_cliente: 'asc' } }),
            prisma.cliente.count({ where }),
        ]);
        const data = clientes.map((c) => ({
            id: c.id_cliente,
            name: c.nome_cliente,
            email: c.email_cliente,
            phone: c.telefone_cliente,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
        return res.json({
            data,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        });
    }
}
exports.ListClientesController = ListClientesController;
