"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LogsRepository {
    // Chamado por debaixo dos panos pelos outros serviços
    async create(data) {
        return prisma.logOperacao.create({
            data
        });
    }
    // Chamado apenas pelo Administrador
    async findAll() {
        return prisma.logOperacao.findMany({
            orderBy: { data_hora_log: 'desc' }, // Traz os mais recentes primeiro
            include: {
                usuario: {
                    select: { nome_usuario: true, email_usuario: true }
                }
            }
        });
    }
}
exports.LogsRepository = LogsRepository;
