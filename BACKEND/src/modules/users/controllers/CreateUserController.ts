import { Request, Response } from 'express';
import { CreateUserService } from '../../auth/services/CreateUserService';

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, nome, email, password, senha, role, teamId, equipeId } = req.body;
    const usuarioResponsavelId = req.user.id;

    try {
      const createUserService = new CreateUserService();
      const user = await createUserService.execute({
        nome:    name ?? nome,
        email,
        senha:   password ?? senha,
        role,
        equipeId: teamId ?? equipeId,
        usuarioResponsavelId,
      });

      return res.status(201).json({
        id:        user.id,
        name:      user.nome,
        email:     user.email,
        role:      user.role,
        teamId:    user.equipeId,
        active:    true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
