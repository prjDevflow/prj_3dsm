"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNegotiationService = void 0;
const NegotiationsRepository_1 = require("../repositories/NegotiationsRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
const Negotiation_1 = require("../../../domain/models/Negotiation");
class CreateNegotiationService {
    negotiationsRepository;
    createLogService;
    constructor() {
        this.negotiationsRepository = new NegotiationsRepository_1.NegotiationsRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute(data) {
        // 🚨 VALIDAÇÃO DO RF03: Verifica ativamente se o Lead já tem uma negociação aberta!
        const negociacaoAtiva = await this.negotiationsRepository.findActiveByLeadId(data.leadId);
        if (negociacaoAtiva) {
            const error = new Error("Regra de Negócio Violada (RF03): Este Lead já possui uma negociação ativa aberta.");
            error.statusCode = 400; // O nosso controller agora sabe ler isto e devolverá o Status 400!
            throw error;
        }
        // 1. Cria a negociação (agora segura!)
        const negotiation = await this.negotiationsRepository.create({
            leadId: data.leadId,
            importancia: data.importancia,
            estagio: data.estagio,
            status: Negotiation_1.NegotiationStatus.ABERTA,
            isAberta: true
        });
        // 2. Grava o histórico inicial da Negociação (RF03)
        await this.negotiationsRepository.createHistory({
            negotiationId: negotiation.id,
            statusAnterior: '-',
            statusNovo: negotiation.status,
            estagioAnterior: '-',
            estagioNovo: negotiation.estagio,
            usuarioId: data.usuarioLogadoId
        });
        // 3. Regista a operação na tabela de auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.CREATE,
            entidade: 'NEGOCIACAO',
            entidadeId: negotiation.id,
            usuarioResponsavelId: data.usuarioLogadoId
        });
        return negotiation;
    }
}
exports.CreateNegotiationService = CreateNegotiationService;
