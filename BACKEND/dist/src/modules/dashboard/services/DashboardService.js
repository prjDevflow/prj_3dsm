"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const DateValidator_1 = require("../../../shared/utils/DateValidator");
const prisma = new client_1.PrismaClient();
class DashboardService {
    async execute({ role, userId, equipeId, inicio, fim }) {
        // 1. Validação Temporal (RF06) - Padrão 30 dias, limite 1 ano para não-admins
        const { startDate, endDate } = DateValidator_1.DateValidator.validate(inicio, fim, role);
        // 2. Filtro de Segurança Baseado em Papel (RF02)
        const baseWhere = {
            data_criacao_lead: { gte: startDate, lte: endDate }
        };
        if (role === 'GERENTE') {
            if (!equipeId)
                throw new Error("Gerente sem equipa vinculada.");
            // O Gerente só vê os leads dos utilizadores que pertencem à sua equipa
            baseWhere.usuario = { id_equipe: equipeId };
        }
        // 3. Recolha de Dados (Dashboard Operacional - RF04)
        const totalLeads = await prisma.lead.count({ where: baseWhere });
        // Agrupamentos Operacionais
        const leadsPorOrigem = await prisma.lead.groupBy({
            by: ['id_origem'],
            where: baseWhere,
            _count: { id_lead: true }
        });
        const leadsPorLoja = await prisma.lead.groupBy({
            by: ['id_loja'],
            where: baseWhere,
            _count: { id_lead: true }
        });
        // 4. Recolha de Dados (Dashboard Analítico - RF05)
        // Para métricas de negociação, fazemos join partindo das negociações dos leads filtrados
        const negociacoes = await prisma.negociacao.findMany({
            where: {
                lead: baseWhere
            },
            include: {
                status: true,
                estagio: true,
                lead: {
                    include: { usuario: true }
                }
            }
        });
        let convertidos = 0;
        let finalizados = 0;
        const distribuicaoImportancia = { FRIO: 0, MORNO: 0, QUENTE: 0 };
        const motivosFinalizacao = {};
        const leadsPorAtendente = {};
        negociacoes.forEach(neg => {
            // Importância
            if (distribuicaoImportancia[neg.importancia_negociacao] !== undefined) {
                distribuicaoImportancia[neg.importancia_negociacao]++;
            }
            // Atendente
            const nomeAtendente = neg.lead.usuario.nome_usuario;
            leadsPorAtendente[nomeAtendente] = (leadsPorAtendente[nomeAtendente] || 0) + 1;
            // Conversão e Finalização (Assumimos que o status nome_status define se está finalizado/convertido)
            const nomeStatus = neg.status.nome_status.toUpperCase();
            if (nomeStatus === 'CONVERTIDO' || nomeStatus === 'GANHO') {
                convertidos++;
                finalizados++;
            }
            else if (nomeStatus === 'PERDIDO' || nomeStatus === 'CANCELADO') {
                finalizados++;
                if (neg.motivo_finalizacao_negociacao) {
                    motivosFinalizacao[neg.motivo_finalizacao_negociacao] = (motivosFinalizacao[neg.motivo_finalizacao_negociacao] || 0) + 1;
                }
            }
        });
        const taxaConversao = finalizados > 0 ? ((convertidos / finalizados) * 100).toFixed(2) + '%' : '0%';
        // 5. Retorno Consolidado
        return {
            periodo: { inicio: startDate, fim: endDate },
            operacional: {
                totalLeads,
                leadsPorOrigem,
                leadsPorLoja
            },
            analitico: {
                totalConvertidos: convertidos,
                totalNaoConvertidos: finalizados - convertidos,
                taxaConversao,
                distribuicaoImportancia,
                motivosFinalizacao,
                leadsPorAtendente
            }
        };
    }
}
exports.DashboardService = DashboardService;
