"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNegotiationSchema = exports.createLeadSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const Negotiation_1 = require("../../../../domain/models/Negotiation");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("E-mail inválido"),
        senha: zod_1.z.string().min(3, "A senha deve ter no mínimo 3 caracteres")
    })
});
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        clienteId: zod_1.z.string().min(1, "ID do cliente é obrigatório"),
        lojaId: zod_1.z.string().min(1, "Loja é obrigatória"),
        origem: zod_1.z.string().min(1, "Origem é obrigatória")
    })
});
exports.updateNegotiationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("ID da negociação inválido")
    }),
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(Negotiation_1.NegotiationStatus),
        estagio: zod_1.z.string().min(1, "Estágio é obrigatório")
    })
});
