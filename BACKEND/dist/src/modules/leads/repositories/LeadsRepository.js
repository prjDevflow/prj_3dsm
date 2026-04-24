"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LeadsRepository {
    // ---------------------------------------------------------
    // MÉTODOS DE CRIAÇÃO E LISTAGEM
    // ---------------------------------------------------------
    async create(data) {
        return prisma.lead.create({
            data
        });
    }
    // Lista todos (Administrador e Gerente Geral)
    async findAll(startDate, endDate) {
        return prisma.lead.findMany({
            where: {
                data_criacao_lead: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                cliente: true,
                usuario: true,
                loja: true,
                origem: true
            }
        });
    }
    // Lista apenas os leads dos Atendentes da equipa do Gerente
    async findByEquipeDoGerente(gerenteId, startDate, endDate) {
        const gerente = await prisma.usuario.findUnique({ where: { id_usuario: gerenteId } });
        return prisma.lead.findMany({
            where: {
                usuario: {
                    id_equipe: gerente?.id_equipe // Filtra pela mesma equipa do gerente
                },
                data_criacao_lead: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                cliente: true,
                usuario: true,
                loja: true,
                origem: true
            }
        });
    }
    // Lista apenas os leads do próprio Atendente
    async findByAtendente(atendenteId, startDate, endDate) {
        return prisma.lead.findMany({
            where: {
                id_usuario: atendenteId,
                data_criacao_lead: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                cliente: true,
                usuario: true,
                loja: true,
                origem: true
            }
        });
    }
    // ---------------------------------------------------------
    // MÉTODOS DE VALIDAÇÃO E ATUALIZAÇÃO (RF02)
    // ---------------------------------------------------------
    // Traz o Lead com a equipa do dono para validarmos o pertencimento antes de editar
    async findByIdWithDetails(id_lead) {
        return prisma.lead.findUnique({
            where: { id_lead },
            include: {
                usuario: {
                    select: { id_usuario: true, id_equipe: true }
                }
            }
        });
    }
    async update(id_lead, data) {
        return prisma.lead.update({
            where: { id_lead },
            data
        });
    }
}
exports.LeadsRepository = LeadsRepository;
