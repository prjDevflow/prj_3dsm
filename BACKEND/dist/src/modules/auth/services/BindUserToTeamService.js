"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindUserToTeamService = void 0;
const UsersRepository_1 = require("../repositories/UsersRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class BindUserToTeamService {
    usersRepository;
    createLogService;
    constructor() {
        this.usersRepository = new UsersRepository_1.UsersRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ gerenteLogadoId, atendenteAlvoId }) {
        // 1. Valida quem está a fazer o pedido (O Gerente)
        const gerente = await this.usersRepository.findById(gerenteLogadoId);
        if (!gerente || !gerente.equipeId) {
            throw new Error("Acesso Negado: O seu usuário não possui uma equipe vinculada para gerenciar.");
        }
        // 2. Valida o alvo (O Atendente)
        const atendente = await this.usersRepository.findById(atendenteAlvoId);
        if (!atendente) {
            throw new Error("Usuário alvo não encontrado.");
        }
        // 3. REGRA DE OURO (RF02): Impede que o gerente vincule outros gerentes ou admins à sua equipe
        if (atendente.role !== 'ATENDENTE') {
            throw new Error("Operação Inválida: Apenas usuários com o perfil 'ATENDENTE' podem ser vinculados a uma equipe.");
        }
        // 4. Executa a vinculação na base de dados
        const updatedUser = await this.usersRepository.updateTeam(atendenteAlvoId, gerente.equipeId);
        // 5. Rastreabilidade (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.UPDATE,
            entidade: 'USUARIO',
            entidadeId: atendenteAlvoId,
            usuarioResponsavelId: gerenteLogadoId
        });
        return updatedUser;
    }
}
exports.BindUserToTeamService = BindUserToTeamService;
