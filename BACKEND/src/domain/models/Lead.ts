export enum LeadStatus {
  NOVO = 'NOVO',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  FINALIZADO = 'FINALIZADO'
}

export class Lead {
  id!: string;
  clienteId!: string; // Vínculo obrigatório 
  atendenteId!: string; // Responsável pelo lead (RF02)
  lojaId!: string;
  origem!: string; // WhatsApp, Instagram, etc.
  status!: LeadStatus;
  
  // Datas de auditoria
  criadoEm!: Date;
  atualizadoEm!: Date; // <-- CORREÇÃO: Adicionado para resolver o erro no método save()
  
  // Simulação de Relacionamento para o RF02 (Será substituído por relação no Prisma)
  gerenteResponsavelId?: string; // <-- CORREÇÃO: Adicionado para resolver o erro no findByEquipeDoGerente()
}