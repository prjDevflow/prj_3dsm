"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserCredentialsService = void 0;
const bcryptjs_1 = require("bcryptjs");
const UsersRepository_1 = require("../repositories/UsersRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class UpdateUserCredentialsService {
    usersRepository;
    createLogService;
    constructor() {
        this.usersRepository = new UsersRepository_1.UsersRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ userId, email, senha }) {
        // 1. Busca o utilizador no banco de dados
        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        // 2. Regra de Negócio: Atualização de E-mail
        if (email && email !== user.email) {
            const emailExists = await this.usersRepository.findByEmail(email);
            if (emailExists) {
                throw new Error("Este e-mail já está em uso por outro usuário.");
            }
            user.email = email;
        }
        // 3. Regra de Negócio: Atualização de Senha com Hash Seguro (RNF02)
        if (senha) {
            const hashedPassword = await (0, bcryptjs_1.hash)(senha, 10);
            user.senha = hashedPassword; // Atualiza a propriedade com o hash gerado
        }
        // 4. Salva as alterações na base de dados (PostgreSQL via Prisma)
        const updatedUser = await this.usersRepository.save(user);
        // 5. Rastreabilidade (RF07): Registra a ação no banco
        await this.createLogService.execute({
            acao: Log_1.LogAction.UPDATE,
            entidade: 'USUARIO',
            entidadeId: user.id,
            usuarioResponsavelId: userId // O próprio utilizador fez a alteração
        });
        // Retorna os dados atualizados omitindo a senha para segurança
        return {
            id: updatedUser.id,
            nome: updatedUser.nome,
            email: updatedUser.email,
            role: updatedUser.role
        };
    }
}
exports.UpdateUserCredentialsService = UpdateUserCredentialsService;
