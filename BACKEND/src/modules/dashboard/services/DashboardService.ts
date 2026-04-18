import { PrismaClient } from '@prisma/client';
import { DateValidator } from '../../../shared/utils/DateValidator';

const prisma = new PrismaClient();

interface IDashboardRequest {
  inicio?: string;
  fim?: string;
  role: string;
  userId: string;
}

export class DashboardService {
  async execute({ inicio, fim, role, userId }: IDashboardRequest) {
    // 1. Validação Temporal (RF06 - Limite de 1 ano validado no backend)
    const { startDate, endDate } = DateValidator.validate(inicio, fim, role);

    // 2. Controle de Acesso (RBAC - RF02) - Aplicando a Regra de Ouro
    let leadFiltroBase: any = {
      data_criacao_lead: { gte: startDate, lte: endDate }
    };

    if (role === 'ATENDENTE') {
      leadFiltroBase.id_usuario = userId;
    } else if (role === 'GERENTE') {
      // Busca a equipa do gerente para filtrar os leads APENAS dessa equipa
      const gerente = await prisma.usuario.findUnique({
        where: { id_usuario: userId },
        select: { id_equipe: true }
      });
      leadFiltroBase.usuario = { id_equipe: gerente?.id_equipe };
    }
    // GERENTE_GERAL e ADMIN não recebem filtros adicionais, visualizando tudo.

    // ----------------------------------------------------------------------
    // 3. RF04 - DASHBOARD OPERACIONAL (Métricas Básicas)
    // ----------------------------------------------------------------------
    const totalLeads = await prisma.lead.count({ where: leadFiltroBase });

    // Leads por Origem (Mapeia a relação para devolver o nome ao invés do ID)
    const leadsPorOrigem = await prisma.origem.findMany({
      select: {
        nome_origem: true,
        _count: { select: { leads: { where: leadFiltroBase } } }
      }
    });

    // Leads por Loja
    const leadsPorLoja = await prisma.loja.findMany({
      select: {
        nome_loja: true,
        _count: { select: { leads: { where: leadFiltroBase } } }
      }
    });

    // ----------------------------------------------------------------------
    // 4. RF05 - DASHBOARD ANALÍTICO (Métricas baseadas em Negociações)
    // ----------------------------------------------------------------------
    // O filtro da negociação herda as regras de RBAC e datas do Lead!
    const negociacaoFiltroBase = { lead: leadFiltroBase };

    // Leads por Status
    const leadsPorStatus = await prisma.status.findMany({
      select: {
        nome_status: true,
        _count: { select: { negociacoes: { where: negociacaoFiltroBase } } }
      }
    });

    // Distribuição por Importância
    const leadsPorImportancia = await prisma.negociacao.groupBy({
      by: ['importancia_negociacao'],
      _count: { _all: true },
      where: negociacaoFiltroBase
    });

    // Leads por Atendente
    const leadsPorAtendente = await prisma.usuario.findMany({
      select: {
        nome_usuario: true,
        _count: { select: { leads: { where: leadFiltroBase } } }
      },
      // Só traz utilizadores que de facto têm leads neste filtro
      where: { leads: { some: leadFiltroBase } }
    });

    // Motivos de Finalização
    const motivosFinalizacao = await prisma.negociacao.groupBy({
      by: ['motivo_finalizacao_negociacao'],
      _count: { _all: true },
      where: {
        ...negociacaoFiltroBase,
        estado_abertura_negociacao: false, // Apenas negociações fechadas
        motivo_finalizacao_negociacao: { not: null }
      }
    });

    // Cálculo da Taxa de Conversão
    const totalGanho = await prisma.negociacao.count({
      where: { ...negociacaoFiltroBase, status: { nome_status: 'GANHO' } }
    });
    const totalPerdido = await prisma.negociacao.count({
      where: { ...negociacaoFiltroBase, status: { nome_status: 'PERDIDO' } }
    });

    const totalFinalizados = totalGanho + totalPerdido;
    const taxaConversao = totalFinalizados > 0 ? ((totalGanho / totalFinalizados) * 100).toFixed(2) : "0.00";

    // ----------------------------------------------------------------------
    // 5. Formatação da Resposta para o Frontend
    // ----------------------------------------------------------------------
    return {
      periodo: { inicio: startDate, fim: endDate },
      operacional: {
        totalLeads,
        porOrigem: leadsPorOrigem.map(o => ({ origem: o.nome_origem, quantidade: o._count.leads })),
        porLoja: leadsPorLoja.map(l => ({ loja: l.nome_loja, quantidade: l._count.leads })),
        porStatus: leadsPorStatus.map(s => ({ status: s.nome_status, quantidade: s._count.negociacoes })),
        porImportancia: leadsPorImportancia.map(i => ({ importancia: i.importancia_negociacao, quantidade: i._count._all }))
      },
      analitico: {
        taxaConversao: `${taxaConversao}%`,
        convertidos: totalGanho,
        naoConvertidos: totalPerdido,
        porAtendente: leadsPorAtendente.map(a => ({ atendente: a.nome_usuario, quantidade: a._count.leads })),
        motivosFinalizacao: motivosFinalizacao.map(m => ({ motivo: m.motivo_finalizacao_negociacao, quantidade: m._count._all }))
      }
    };
  }
}