import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../../errors/AppError';

/**
 * Middleware global de tratamento de erros.
 *
 * Deve ser registrado por ÚLTIMO (após as rotas). Captura qualquer erro
 * lançado nas rotas/serviços (graças ao `express-async-errors`) e o converte
 * numa resposta HTTP padronizada.
 *
 * O payload inclui tanto `error` quanto `message` porque o frontend lê ora um,
 * ora outro (ex.: a tela de Login usa `message`; as demais usam `error`).
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1. Erros de domínio previsíveis (validações e regras de negócio)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      error: err.message,
      message: err.message,
    });
  }

  // 2. Erros de validação do Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      error: 'Falha na validação dos dados',
      message: 'Falha na validação dos dados',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  // 3. Erros legados que carregam um statusCode customizado
  const statusCode = (err as Error & { statusCode?: number }).statusCode;
  if (typeof statusCode === 'number') {
    return res.status(statusCode).json({
      status: 'error',
      error: err.message,
      message: err.message,
    });
  }

  // 4. Erro inesperado — registra no servidor e devolve resposta genérica
  console.error('❌ Erro não tratado:', err);
  return res.status(500).json({
    status: 'error',
    error: 'Erro interno do servidor.',
    message: 'Erro interno do servidor.',
  });
}
