"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLogService = void 0;
const LogsRepository_1 = require("../repositories/LogsRepository");
class CreateLogService {
    logsRepository;
    constructor() {
        this.logsRepository = new LogsRepository_1.LogsRepository();
    }
    async execute({ acao, entidade, entidadeId, usuarioResponsavelId }) {
        await this.logsRepository.create({
            id_usuario: usuarioResponsavelId,
            acao_log: acao,
            tabela_afetada_log: entidade,
            id_registro_afetado: entidadeId
        });
    }
}
exports.CreateLogService = CreateLogService;
