"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const UsersRepository_1 = require("../repositories/UsersRepository");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
class AuthService {
    usersRepository;
    createLogService;
    constructor() {
        this.usersRepository = new UsersRepository_1.UsersRepository();
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ email, senha }) {
        // 1. Verifica se o utilizador existe (a busca já ocorre no PostgreSQL via Prisma)
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new Error("E-mail ou palavra-passe incorretos.");
        }
        // 2. Compara a palavra-passe informada com o hash armazenado no banco (RNF02)
        const passwordMatch = await (0, bcryptjs_1.compare)(senha, user.senha);
        if (!passwordMatch) {
            throw new Error("E-mail ou palavra-passe incorretos.");
        }
        // 3. Gera o Token JWT (RF01)
        // A chave secreta deve vir das variáveis de ambiente (.env)
        const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao_desenvolvimento';
        const token = (0, jsonwebtoken_1.sign)({ role: user.role }, // Payload: Papel (role) injetado para o Middleware RBAC
        secret, {
            subject: user.id, // Identificador do utilizador
            expiresIn: '1d' // Tempo de expiração
        });
        // 4. Regista o Log de Acesso (RF07)
        // Assim que o login é validado, gravamos a auditoria na base de dados
        await this.createLogService.execute({
            acao: Log_1.LogAction.LOGIN,
            entidade: 'USUARIO',
            entidadeId: user.id,
            usuarioResponsavelId: user.id
        });
        // 5. Retorna os dados do utilizador e o token (omitindo a palavra-passe por segurança)
        return {
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.role,
                equipeId: user.equipeId
            },
            token
        };
    }
}
exports.AuthService = AuthService;
