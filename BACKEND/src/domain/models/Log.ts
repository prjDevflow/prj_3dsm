export enum LogAction {
  LOGIN = 'LOGIN',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export class Log {
  id!: string;
  acao!: LogAction;
  entidade!: string; // Ex: 'UTILIZADOR', 'LEAD', 'NEGOCIACAO', 'CLIENTE', 'EQUIPA'
  entidadeId?: string; // ID do registo afetado (opcional para o caso de login)
  usuarioResponsavelId!: string; // Quem executou a ação (RF07)
  criadoEm!: Date; // Data e hora da operação (RF07)
}