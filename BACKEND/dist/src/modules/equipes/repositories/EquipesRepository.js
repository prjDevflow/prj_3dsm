"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipesRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EquipesRepository {
    async create(nome_equipe) {
        return prisma.equipe.create({
            data: { nome_equipe }
        });
    }
    async findAll() {
        return prisma.equipe.findMany();
    }
    async findById(id_equipe) {
        return prisma.equipe.findUnique({
            where: { id_equipe }
        });
    }
    async findByName(nome_equipe) {
        return prisma.equipe.findFirst({
            where: { nome_equipe }
        });
    }
    async update(id_equipe, nome_equipe) {
        return prisma.equipe.update({
            where: { id_equipe },
            data: { nome_equipe }
        });
    }
    async delete(id_equipe) {
        await prisma.equipe.delete({
            where: { id_equipe }
        });
    }
}
exports.EquipesRepository = EquipesRepository;
