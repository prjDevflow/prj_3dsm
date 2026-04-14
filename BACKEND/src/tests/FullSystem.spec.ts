import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Tente usar 127.0.0.1 para evitar problemas de resolução de DNS do localhost em alguns ambientes
const api = "http://127.0.0.1:3333"; 

describe("🚀 Teste de Integração: Fluxo Completo 1000 Valle", () => {
  let token: string;
  let clienteId: string;
  let lojaId: string;
  let leadId: string;

  // RF01 - Teste de Autenticação
  it("Deve realizar login como Admin e receber o Token JWT", async () => {
    // IMPORTANTE: Ajustado para /sessions conforme definido no seu routes/index.ts
    const response = await request(api)
      .post("/sessions") 
      .send({
        email: "admin@1000valle.com.br",
        senha: "123"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });

  it("Deve identificar uma loja existente na base", async () => {
    const loja = await prisma.loja.findFirst();
    lojaId = loja!.id_loja;
    expect(lojaId).toBeDefined();
  });

  it("Deve criar um novo cliente via API", async () => {
    const response = await request(api)
      .post("/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Cliente de Teste Automatizado",
        email: `teste${Date.now()}@email.com`,
        telefone: "12988887777"
      });

    expect(response.status).toBe(201);
    // Ajustado para capturar o ID correto do retorno
    clienteId = response.body.id_cliente || response.body.id; 
  });

  it("Deve criar um lead para o cliente recém-criado", async () => {
    // Buscamos uma origem e status válidos criados no Seed para não dar erro de FK
    const origem = await prisma.origem.findFirst();
    
    const response = await request(api)
      .post("/leads")
      .set("Authorization", `Bearer ${token}`)
      .send({
        clienteId,
        lojaId,
        origemId: origem?.id_origem
      });

    console.log("ERRO AO CRIAR LEAD:", response.body);

    expect(response.status).toBe(201);
    leadId = response.body.id_lead || response.body.id;
  });

  it("Deve abrir a primeira negociação para o lead", async () => {
    const response = await request(api)
      .post("/leads/negotiations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        leadId,
        importancia: "QUENTE",
        estagio: "Contato Inicial" // <-- Suspeito nº 1
      });

    console.log("ERRO AO CRIAR NEGOCIACAO:", response.body); // <-- ADICIONE ESTA LINHA

    expect(response.status).toBe(201);
  });

  it("NÃO deve permitir uma segunda negociação aberta para o mesmo lead", async () => {
    const response = await request(api)
      .post("/leads/negotiations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        leadId,
        importancia: "FRIO",
        estagio: "Apresentação"
      });

    // RF03: Bloqueio de duplicidade
    expect(response.status).toBe(400);
  });

  it("Deve listar os logs e conter as ações anteriores (RF07)", async () => {
    const response = await request(api)
      .get("/logs")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Deve retornar as métricas do dashboard (RF04/RF05)", async () => {
    const response = await request(api)
      .get("/dashboard")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("totalLeads");
  });
});