import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UsersRepository {
  
  // ----------------------------------------------------------------------
  // Método utilizado pelo AuthService (RF01 - Autenticação)
  // ----------------------------------------------------------------------
  async findByEmail(email: string) {
    const user = await prisma.usuario.findUnique({
      where: { email_usuario: email },
      include: { papel: true } // Necessário para extrair o 'role' para o JWT
    });

    if (!user) return null;

    return {
      id: user.id_usuario,
      nome: user.nome_usuario,
      email: user.email_usuario,
      senha: user.senha_hash_usuario,
      role: user.papel.nome_papel,
      equipeId: user.id_equipe || undefined
    };
  }

  // ----------------------------------------------------------------------
  // Método utilizado pelo UpdateUserCredentialsService (RF01 - Atualização)
  // E também pelo BindUserToTeamService (RF02 - Validação de Perfil)
  // ----------------------------------------------------------------------
  async findById(id: string) {
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: { papel: true } 
    });

    if (!user) return null;

    return {
      id: user.id_usuario,
      nome: user.nome_usuario,
      email: user.email_usuario,
      senha: user.senha_hash_usuario,
      role: user.papel.nome_papel,
      equipeId: user.id_equipe || undefined
    };
  }

  // ----------------------------------------------------------------------
  // Método utilizado para persistir alterações de credenciais na base (RF01)
  // ----------------------------------------------------------------------
  async save(user: any) {
    const updated = await prisma.usuario.update({
      where: { id_usuario: user.id },
      data: {
        email_usuario: user.email,
        senha_hash_usuario: user.senha
      },
      include: { papel: true }
    });

    return {
      id: updated.id_usuario,
      nome: updated.nome_usuario,
      email: updated.email_usuario,
      senha: updated.senha_hash_usuario,
      role: updated.papel.nome_papel,
      equipeId: updated.id_equipe || undefined
    };
  }

  // ----------------------------------------------------------------------
  // Método utilizado pelo CreateUserService (Administrador cria usuários)
  // ----------------------------------------------------------------------
  async create(data: any) {
    const newUser = await prisma.usuario.create({
      data: {
        nome_usuario: data.nome,
        email_usuario: data.email,
        senha_hash_usuario: data.senha,
        id_papel: data.papelId,
        id_equipe: data.equipeId || null
      },
      include: { papel: true }
    });

    return {
      id: newUser.id_usuario,
      nome: newUser.nome_usuario,
      email: newUser.email_usuario,
      role: newUser.papel.nome_papel,
      equipeId: newUser.id_equipe || undefined
    };
  }

  // ----------------------------------------------------------------------
  // NOVO: Método utilizado pelo BindUserToTeamService (RF02 - Gerente vincula)
  // ----------------------------------------------------------------------
  async updateTeam(userId: string, equipeId: string) {
    const updated = await prisma.usuario.update({
      where: { id_usuario: userId },
      data: { id_equipe: equipeId },
      include: { papel: true }
    });

    return {
      id: updated.id_usuario,
      nome: updated.nome_usuario,
      email: updated.email_usuario,
      role: updated.papel.nome_papel,
      equipeId: updated.id_equipe || undefined
    };
  }
}