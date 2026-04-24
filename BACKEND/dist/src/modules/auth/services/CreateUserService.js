"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const client_1 = require("@prisma/client");
const CreateLogService_1 = require("../../logs/services/CreateLogService");
const Log_1 = require("../../../domain/models/Log");
const prisma = new client_1.PrismaClient();
class CreateUserService {
    createLogService;
    constructor() {
        this.createLogService = new CreateLogService_1.CreateLogService();
    }
    async execute({ nome, email, senha, role, equipeId, usuarioResponsavelId }) {
        // 1. Verifica se o e-mail já está em uso (Garante a restrição UNIQUE do banco)
        const userExists = await prisma.usuario.findUnique({
            where: { email_usuario: email }
        });
        if (userExists) {
            throw new Error("Já existe um utilizador registado com este e-mail.");
        }
        // 2. Procura o ID do Papel baseado na string enviada (ex: 'ATENDENTE')
        const papel = await prisma.papel.findUnique({
            where: { nome_papel: role }
        });
        if (!papel) {
            throw new Error(`O papel '${role}' não existe na base de dados. Contacte o suporte.`);
        }
        // 3. Encripta a palavra-passe (RNF02)
        // O custo (salt) de 8 é equilibrado para performance e segurança no backend
        const passwordHash = await (0, bcryptjs_1.hash)(senha, 8);
        // 4. Cria o utilizador na base de dados PostgreSQL
        const usuarioCriado = await prisma.usuario.create({
            data: {
                nome_usuario: nome,
                email_usuario: email,
                senha_hash_usuario: passwordHash,
                id_papel: papel.id_papel,
                id_equipe: equipeId || null
            }
        });
        // 5. Regista a operação na tabela de auditoria (RF07)
        await this.createLogService.execute({
            acao: Log_1.LogAction.CREATE,
            entidade: 'USUARIO',
            entidadeId: usuarioCriado.id_usuario,
            usuarioResponsavelId: usuarioResponsavelId
        });
        // 6. Retorna os dados do utilizador criado (mascateando a palavra-passe por segurança)
        return {
            id: usuarioCriado.id_usuario,
            nome: usuarioCriado.nome_usuario,
            email: usuarioCriado.email_usuario,
            role: role,
            equipeId: usuarioCriado.id_equipe
        };
    }
}
exports.CreateUserService = CreateUserService;
