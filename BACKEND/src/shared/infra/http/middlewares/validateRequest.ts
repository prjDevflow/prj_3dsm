import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

/**
 * Middleware de validação de entrada. Recebe um schema Zod (objeto ou refinado)
 * e valida body / query / params antes de chegar ao controller.
 *
 * Em caso de falha responde 400 com `error` (primeira mensagem, lida pela maioria
 * das telas) e `errors` (lista campo a campo). Erros não-Zod são repassados ao
 * tratador global de erros.
 */
export const validateRequest = (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        return res.status(400).json({
          status: 'error',
          error: errors[0]?.message ?? 'Falha na validação dos dados',
          message: 'Falha na validação dos dados',
          errors,
        });
      }

      return next(error);
    }
  };
