import { z } from 'zod';

/**
 * Schemas de validação de entrada (Zod), aplicados via middleware `validateRequest`.
 * Cada schema valida body / params / query da requisição ANTES de chegar ao controller.
 *
 * Os schemas refletem o contrato real consumido pelo frontend (incluindo aliases
 * de campos como name/nome e phone/telefone), para validar sem quebrar as telas.
 */

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(3, 'A senha deve ter no mínimo 3 caracteres'),
  }),
});

// Criação de Lead — aceita o payload "humano" (name/email/phone/store/origin)
// e também o legado por UUID (clienteId/lojaId/origemId).
export const createLeadSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      email: z.string().email('E-mail inválido').optional(),
      phone: z.string().optional(),
      store: z.string().optional(),
      origin: z.string().optional(),
      assignedTo: z.string().optional(),
      clienteId: z.string().optional(),
      lojaId: z.string().optional(),
      origemId: z.string().optional(),
      origem: z.string().optional(),
    })
    .refine(
      (b) =>
        Boolean(b.clienteId || b.email) &&
        Boolean(b.lojaId || b.store) &&
        Boolean(b.origemId || b.origem || b.origin),
      {
        message:
          'Informe cliente (clienteId ou email), loja (lojaId ou store) e origem (origemId, origem ou origin).',
      },
    ),
});

// Criação de Negociação (RF03)
export const createNegotiationSchema = z.object({
  body: z.object({
    leadId: z.string().min(1, 'leadId é obrigatório'),
    importancia: z.string().min(1).optional(),
    estagio: z.string().min(1).optional(),
    conteudo: z.string().optional(),
  }),
});

// Atualização de Negociação (status / estágio / importância)
export const updateNegotiationSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID da negociação inválido'),
  }),
  body: z.object({
    statusId: z.string().optional(),
    estagioId: z.string().optional(),
    importancia: z.string().optional(),
  }),
});

// Criação de Cliente — aceita aliases name/nome e phone/telefone
export const createClienteSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      nome: z.string().optional(),
      email: z.string().email('E-mail inválido'),
      phone: z.string().optional(),
      telefone: z.string().optional(),
      cpf: z.string().nullish(),
      leadId: z.string().nullish(),
      lead_id: z.string().nullish(),
      consultorId: z.string().nullish(),
      assignedTo: z.string().nullish(),
    })
    .refine((b) => Boolean(b.name || b.nome), { message: 'Nome é obrigatório.' })
    .refine((b) => Boolean(b.phone || b.telefone), { message: 'Telefone é obrigatório.' }),
});

// Criação de Loja
export const createLojaSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome da loja é obrigatório'),
  }),
});

// Criação de Origem
export const createOrigemSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome da origem é obrigatório'),
  }),
});
