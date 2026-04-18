export enum LeadStatus {
  NOVO = 'NOVO',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  FINALIZADO = 'FINALIZADO'
}

export class Lead {
  id!: string;
  clienteId!: string; 
  atendenteId!: string; // RF02
  lojaId!: string;
  origem!: string; 
  
  criadoEm!: Date;
  
  gerenteResponsavelId?: string;
}