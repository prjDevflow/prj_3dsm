import { PrismaClient } from '@prisma/client';
import { DateValidator } from '../../../shared/utils/DateValidator';

const prisma = new PrismaClient();

interface IDashboardRequest {
  inicio?: string;
  fim?: string;
  role: string;
  userId: string; // <-- Corrigido: Agora o serviço reconhece o userId
}

export class DashboardService {
  async execute({ inicio, fim, role, userId }: IDashboardRequest) {
    // Chama o método estático correto
    const { startDate, endDate } = DateValidator.validate(inicio, fim, role);

    const totalLeads = await prisma.lead.count({
      where: {
        data_criacao_lead: { gte: startDate, lte: endDate }
      }
    });

    // Filtros simplificados para o Dashboard
    const leadsPorStatus = await prisma.lead.groupBy({
      by: ['id_status'],
      _count: { id_lead: true },
      where: { data_criacao_lead: { gte: startDate, lte: endDate } }
    });

    return {
      periodo: { inicio: startDate, fim: endDate },
      totalLeads,
      distribuicao: leadsPorStatus
    };
  }
}