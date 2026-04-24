"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLeadService = void 0;
const LeadsRepository_1 = require("../repositories/LeadsRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class UpdateLeadService {
    leadsRepository;
    createLogService;
    constructor() {
        this.leadsRepository = new LeadsRepository_1.LeadsRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute(data) {
        const lead = await this.leadsRepository.findByIdWithDetails(data.leadId);
        if (!lead) {
            const error = new Error("Lead não encontrado.");
            error.statusCode = 404;
            throw error;
        }
        // 🚨 REGRA DE OURO (RF02) - Validação Granular de Pertencimento no Backend 🚨
        if (data.usuarioLogadoRole === 'ATENDENTE') {
            if (lead.usuario.id_usuario !== data.usuarioLogadoId) {
                const error = new Error("Acesso negado: Só pode editar leads sob a sua responsabilidade.");
                error.statusCode = 403;
                throw error;
            }
        }
        else if (data.usuarioLogadoRole === 'GERENTE') {
            if (lead.usuario.id_equipe !== data.usuarioLogadoEquipeId) {
                const error = new Error("Acesso negado: Só pode editar leads de atendentes da sua equipa.");
                error.statusCode = 403;
                throw error;
            }
        }
        else if (data.usuarioLogadoRole === 'GERENTE_GERAL') {
            const error = new Error("Acesso negado: O Gerente Geral não tem permissão para editar leads.");
            error.statusCode = 403;
            throw error;
        }
        // Se for ADMIN, passa direto (tem acesso total)
        const leadAtualizado = await this.leadsRepository.update(data.leadId, {
            id_loja: data.lojaId,
            id_origem: data.origemId,
            id_usuario: data.atendenteId // Apenas se houver reatribuição
        });
        // Auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.UPDATE,
            entidade: 'LEAD',
            entidadeId: leadAtualizado.id_lead,
            usuarioResponsavelId: data.usuarioLogadoId
        });
        return leadAtualizado;
    }
}
exports.UpdateLeadService = UpdateLeadService;
