"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNegotiationService = void 0;
const NegotiationsRepository_1 = require("../repositories/NegotiationsRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class UpdateNegotiationService {
    negotiationsRepository;
    createLogService;
    constructor() {
        this.negotiationsRepository = new NegotiationsRepository_1.NegotiationsRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute(data) {
        const negociacaoAntiga = await this.negotiationsRepository.findById(data.negotiationId);
        if (!negociacaoAntiga) {
            const error = new Error("Negociação não encontrada.");
            error.statusCode = 404;
            throw error;
        }
        // 1. Atualiza a Negociação
        const negociacaoAtualizada = await this.negotiationsRepository.update(data.negotiationId, {
            id_status: data.statusId,
            id_estagio: data.estagioId,
            importancia_negociacao: data.importancia,
        });
        // 2. Regra de Negócio (RF03): Manter Histórico das mudanças
        // CORREÇÃO APLICADA AQUI: Utilizamos .status e .estagio conforme o seu domínio
        await this.negotiationsRepository.createHistory({
            negotiationId: data.negotiationId,
            statusAnterior: negociacaoAntiga.status,
            statusNovo: data.statusId,
            estagioAnterior: negociacaoAntiga.estagio,
            estagioNovo: data.estagioId,
            usuarioId: data.usuarioLogadoId
        });
        // 3. Auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.UPDATE,
            entidade: 'NEGOCIACAO',
            entidadeId: data.negotiationId,
            usuarioResponsavelId: data.usuarioLogadoId
        });
        return negociacaoAtualizada;
    }
}
exports.UpdateNegotiationService = UpdateNegotiationService;
