import { differenceInDays, parseISO, isValid } from 'date-fns';
import { UserRole } from '../../domain/models/UserRole';

export class DateValidator {
  /**
   * Valida se o período entre duas datas respeita as regras de negócio (RF06).
   */
  static validateFilterRange(startDate: string, endDate: string, role: string): { start: Date, end: Date } {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Validação básica de datas
    if (!isValid(start) || !isValid(end)) {
      throw new Error("Formato de data inválido. Utilize o formato ISO (ex: YYYY-MM-DD).");
    }

    if (start > end) {
      throw new Error("A data inicial não pode ser superior à data final.");
    }

    // RF06: Se for Administrador, não há limitação de período
    if (role === UserRole.ADMIN) {
      return { start, end };
    }

    // RF06: Limitação máxima de 1 ano (365 dias) para utilizadores não administradores
    const diffInDays = differenceInDays(end, start);
    
    if (diffInDays > 365) {
      throw new Error("Acesso negado: O período máximo para filtragem é de 1 ano para utilizadores não administradores.");
    }

    return { start, end };
  }
}