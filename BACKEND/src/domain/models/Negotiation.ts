export enum NegotiationStatus {
  ABERTA = "ABERTA",
  GANHO = "GANHO",
  PERDIDO = "PERDIDO"
}

export interface Negotiation {
  id: string;
  leadId: string;
  atendenteId: string;
  importancia: 'FRIO' | 'MORNO' | 'QUENTE'; // RF03
  status: NegotiationStatus;
  estagio: string;
  isAberta: boolean;
  motivoFinalizacao?: string | null; // CORREÇÃO: Adicionado
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface NegotiationHistory {
  id: string;
  negotiationId: string;
  statusAnterior: string;
  statusNovo: string;
  estagioAnterior: string;
  estagioNovo: string;
  usuarioId: string; // RF07
  criadoEm: Date;
}