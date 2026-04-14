import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { CreateLogService } from '../../logs/services/CreateLogService';
import { LogAction } from '../../../domain/models/Log';
import { UserRole } from '../../../domain/models/UserRole';

const prisma = new PrismaClient();

interface ICreateUserRequest {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  equipeId?: string;
  usuarioResponsavelId: string; // O ID de quem está a executar a ação (RF07)
}

export class CreateUserService {
  private createLogService: CreateLogService;

  constructor() {
    this.createLogService = new CreateLogService();
  }

  async execute({ nome, email, senha, role, equipeId, usuarioResponsavelId }: ICreateUserRequest) {
    // 1. Verifica se o e-mail já está em uso (Garante a restrição UNIQUE do banco)
    const userExists = await prisma.usuario.findUnique({
      where: { email_usuario: email }
    });

    if (userExists) {
      throw new Error("Já existe um utilizador registado com este e-mail.");
    }

    // 2. Procura o ID do Papel baseado na string enviada (ex: 'ATENDENTE')
    const papel = await prisma.papel.findUnique({
      where: { nome_papel: role }
    });

    if (!papel) {
      throw new Error(`O papel '${role}' não existe na base de dados. Contacte o suporte.`);
    }

    // 3. Encripta a palavra-passe (RNF02)
    // O custo (salt) de 8 é equilibrado para performance e segurança no backend
    const passwordHash = await hash(senha, 8);

    // 4. Cria o utilizador na base de dados PostgreSQL
    const usuarioCriado = await prisma.usuario.create({
      data: {
        nome_usuario: nome,
        email_usuario: email,
        senha_hash_usuario: passwordHash,
        id_papel: papel.id_papel,
        id_equipe: equipeId || null
      }
    });

    // 5. Regista a operação na tabela de auditoria (RF07)
    await this.createLogService.execute({
      acao: LogAction.CREATE,
      entidade: 'USUARIO',
      entidadeId: usuarioCriado.id_usuario,
      usuarioResponsavelId: usuarioResponsavelId
    });

    // 6. Retorna os dados do utilizador criado (mascateando a palavra-passe por segurança)
    return {
      id: usuarioCriado.id_usuario,
      nome: usuarioCriado.nome_usuario,
      email: usuarioCriado.email_usuario,
      role: role,
      equipeId: usuarioCriado.id_equipe
    };
  }
}