"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeadService = void 0;
const LeadsRepository_1 = require("../repositories/LeadsRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class CreateLeadService {
    leadsRepository;
    createLogService;
    constructor() {
        this.leadsRepository = new LeadsRepository_1.LeadsRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ clienteId, lojaId, origemId, usuarioLogadoId }) {
        // 1. Criação do Lead mapeando as propriedades para os nomes exatos do banco de dados (Prisma)
        const lead = await this.leadsRepository.create({
            id_cliente: clienteId,
            id_loja: lojaId,
            id_origem: origemId,
            id_usuario: usuarioLogadoId // O atendente logado é o responsável
        });
        // 2. Regista a operação na tabela de auditoria (RF07)
        // Utilizamos lead.id_lead pois é o nome exato da PK no schema.prisma
        await this.createLogService.execute({
            acao: Log_1.LogAction.CREATE,
            entidade: 'LEAD',
            entidadeId: lead.id_lead,
            usuarioResponsavelId: usuarioLogadoId
        });
        return lead;
    }
}
exports.CreateLeadService = CreateLeadService;
