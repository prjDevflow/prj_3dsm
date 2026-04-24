"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Tente usar 127.0.0.1 para evitar problemas de resolução de DNS do localhost em alguns ambientes
const api = "http://127.0.0.1:3333";
(0, globals_1.describe)("🚀 Teste de Integração: Fluxo Completo 1000 Valle", () => {
    let token;
    let clienteId;
    let lojaId;
    let leadId;
    // RF01 - Teste de Autenticação
    (0, globals_1.it)("Deve realizar login como Admin e receber o Token JWT", async () => {
        // IMPORTANTE: Ajustado para /sessions conforme definido no seu routes/index.ts
        const response = await (0, supertest_1.default)(api)
            .post("/sessions")
            .send({
            email: "admin@1000valle.com.br",
            senha: "123"
        });
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toHaveProperty("token");
        token = response.body.token;
    });
    (0, globals_1.it)("Deve identificar uma loja existente na base", async () => {
        const loja = await prisma.loja.findFirst();
        lojaId = loja.id_loja;
        (0, globals_1.expect)(lojaId).toBeDefined();
    });
    (0, globals_1.it)("Deve criar um novo cliente via API", async () => {
        const response = await (0, supertest_1.default)(api)
            .post("/clientes")
            .set("Authorization", `Bearer ${token}`)
            .send({
            nome: "Cliente de Teste Automatizado",
            email: `teste${Date.now()}@email.com`,
            telefone: "12988887777"
        });
        (0, globals_1.expect)(response.status).toBe(201);
        // Ajustado para capturar o ID correto do retorno
        clienteId = response.body.id_cliente || response.body.id;
    });
    (0, globals_1.it)("Deve criar um lead para o cliente recém-criado", async () => {
        // Buscamos uma origem e status válidos criados no Seed para não dar erro de FK
        const origem = await prisma.origem.findFirst();
        const response = await (0, supertest_1.default)(api)
            .post("/leads")
            .set("Authorization", `Bearer ${token}`)
            .send({
            clienteId,
            lojaId,
            origemId: origem?.id_origem
        });
        console.log("ERRO AO CRIAR LEAD:", response.body);
        (0, globals_1.expect)(response.status).toBe(201);
        leadId = response.body.id_lead || response.body.id;
    });
    (0, globals_1.it)("Deve abrir a primeira negociação para o lead", async () => {
        const response = await (0, supertest_1.default)(api)
            .post("/leads/negotiations")
            .set("Authorization", `Bearer ${token}`)
            .send({
            leadId,
            importancia: "QUENTE",
            estagio: "Contato Inicial" // <-- Suspeito nº 1
        });
        console.log("ERRO AO CRIAR NEGOCIACAO:", response.body); // <-- ADICIONE ESTA LINHA
        (0, globals_1.expect)(response.status).toBe(201);
    });
    (0, globals_1.it)("NÃO deve permitir uma segunda negociação aberta para o mesmo lead", async () => {
        const response = await (0, supertest_1.default)(api)
            .post("/leads/negotiations")
            .set("Authorization", `Bearer ${token}`)
            .send({
            leadId,
            importancia: "FRIO",
            estagio: "Apresentação"
        });
        // RF03: Bloqueio de duplicidade
        (0, globals_1.expect)(response.status).toBe(400);
    });
    (0, globals_1.it)("Deve listar os logs e conter as ações anteriores (RF07)", async () => {
        const response = await (0, supertest_1.default)(api)
            .get("/logs")
            .set("Authorization", `Bearer ${token}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body.length).toBeGreaterThan(0);
    });
    (0, globals_1.it)("Deve retornar as métricas do dashboard (RF04/RF05)", async () => {
        const response = await (0, supertest_1.default)(api)
            .get("/dashboard")
            .set("Authorization", `Bearer ${token}`);
        (0, globals_1.expect)(response.status).toBe(200);
        (0, globals_1.expect)(response.body).toHaveProperty("totalLeads");
    });
});
