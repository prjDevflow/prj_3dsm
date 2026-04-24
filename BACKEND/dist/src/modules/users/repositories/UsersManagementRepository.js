"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersManagementRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UsersManagementRepository {
    async findAll() {
        // Retornamos os dados omitindo a senha por segurança
        return prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nome_usuario: true,
                email_usuario: true,
                data_criacao_usuario: true,
                papel: { select: { nome_papel: true } },
                equipe: { select: { nome_equipe: true } }
            }
        });
    }
    async findById(id_usuario) {
        return prisma.usuario.findUnique({
            where: { id_usuario }
        });
    }
    async update(id_usuario, data) {
        return prisma.usuario.update({
            where: { id_usuario },
            data,
            select: {
                id_usuario: true,
                nome_usuario: true,
                email_usuario: true,
                papel: { select: { nome_papel: true } }
            }
        });
    }
    async delete(id_usuario) {
        await prisma.usuario.delete({
            where: { id_usuario }
        });
    }
}
exports.UsersManagementRepository = UsersManagementRepository;
