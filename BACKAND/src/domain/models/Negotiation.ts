export enum NegotiationStatus {
  ABERTA = "ABERTA",
  GANHO = "GANHO",
  PERDIDO = "PERDIDO"
}

export interface Negotiation {
  id: string;
  leadId: string;
  atendenteId: string;
  importancia: 'FRIO' | 'MORNO' | 'QUENTE'; // RF03 [cite: 127]
  status: NegotiationStatus;
  estagio: string;
  isAberta: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

// Entidade para o Histórico (RF03 - Manter histórico [cite: 131])
export interface NegotiationHistory {
  id: string;
  negotiationId: string;
  statusAnterior: string;
  statusNovo: string;
  estagioAnterior: string;
  estagioNovo: string;
  usuarioId: string; // Quem fez a alteração (RF07 [cite: 177])
  criadoEm: Date;
}