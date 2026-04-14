import { z } from 'zod';
import { NegotiationStatus } from '../../../../domain/models/Negotiation';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(3, "A senha deve ter no mínimo 3 caracteres")
  })
});

export const createLeadSchema = z.object({
  body: z.object({
    clienteId: z.string().min(1, "ID do cliente é obrigatório"),
    lojaId: z.string().min(1, "Loja é obrigatória"),
    origem: z.string().min(1, "Origem é obrigatória")
  })
});
 
export const updateNegotiationSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID da negociação inválido")
  }),
  body: z.object({
    status: z.nativeEnum(NegotiationStatus),
    estagio: z.string().min(1, "Estágio é obrigatório")
  })
});