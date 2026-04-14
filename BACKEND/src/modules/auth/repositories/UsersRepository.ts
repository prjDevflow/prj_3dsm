import { PrismaClient } from '@prisma/client';
import { User } from "../../../domain/models/User";
import { UserRole } from "../../../domain/models/UserRole";

const prisma = new PrismaClient();

export class UsersRepository {
  
  /**
   * RF01 - Busca de utilizador por e-mail para autenticação
   */
  async findByEmail(email: string): Promise<User | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { email_usuario: email },
      include: { 
        papel: true // JOIN obrigatório para extrair a Role e aplicar o RF02
      } 
    });

    if (!usuario) {
      return null;
    }

    return this.mapToDomain(usuario);
  }

  /**
   * Auxiliar para recuperar utilizador por ID (Usado internamente e no Middleware JWT)
   */
  async findById(id: string): Promise<User | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: { 
        papel: true 
      }
    });

    if (!usuario) {
      return null;
    }

    return this.mapToDomain(usuario);
  }

  /**
   * Mapeamento seguro da Base de Dados para o nosso Domínio de Aplicação
   * RNF13 - Separação de responsabilidades e coesão
   */
  private mapToDomain(usuario: any): User {
    return {
      id: usuario.id_usuario,
      nome: usuario.nome_usuario,
      email: usuario.email_usuario,
      senha: usuario.senha_hash_usuario, // Hash bcrypt (RNF02)
      role: usuario.papel.nome_papel as UserRole, // Converte a string do banco para o nosso Enum de Domínio
      equipeId: usuario.id_equipe || undefined,
      criadoEm: usuario.data_criacao_usuario
    };
  }
}