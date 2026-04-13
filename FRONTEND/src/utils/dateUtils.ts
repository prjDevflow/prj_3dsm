import { differenceInDays, parseISO, isAfter, isBefore } from 'date-fns';

export const MAX_DAYS_NON_ADMIN = 365; // 1 ano
export const MAX_DAYS_ADMIN = Infinity; // Sem limite

export interface DateRange {
  start: Date;
  end: Date;
}

export const validateDateRange = (
  range: DateRange,
  isAdmin: boolean = false
): { isValid: boolean; message?: string; adjustedRange?: DateRange } => {
  const maxDays = isAdmin ? MAX_DAYS_ADMIN : MAX_DAYS_NON_ADMIN;
  const daysDiff = differenceInDays(range.end, range.start);

  // Se for admin, sempre válido
  if (isAdmin) {
    return { isValid: true, adjustedRange: range };
  }

  // Se o período for maior que 1 ano
  if (daysDiff > maxDays) {
    const adjustedStart = new Date(range.end);
    adjustedStart.setDate(adjustedStart.getDate() - maxDays);
    
    return {
      isValid: false,
      message: `Período máximo permitido é de 1 ano. Ajustado automaticamente.`,
      adjustedRange: {
        start: adjustedStart,
        end: range.end
      }
    };
  }

  // Se a data final for menor que a inicial
  if (isBefore(range.end, range.start)) {
    return {
      isValid: false,
      message: 'Data final não pode ser menor que data inicial',
      adjustedRange: {
        start: range.start,
        end: range.start
      }
    };
  }

  // Se o período for negativo
  if (daysDiff < 0) {
    return {
      isValid: false,
      message: 'Período inválido',
      adjustedRange: {
        start: range.start,
        end: range.start
      }
    };
  }

  return { isValid: true, adjustedRange: range };
};

export const formatDateRange = (start: Date, end: Date): string => {
  const days = differenceInDays(end, start);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias`;
  if (days < 30) return `${Math.floor(days / 7)} semanas`;
  if (days < 365) return `${Math.floor(days / 30)} meses`;
  return `${Math.floor(days / 365)} anos`;
};