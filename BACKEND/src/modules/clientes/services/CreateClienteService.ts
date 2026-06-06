import { AppError } from '../../../shared/errors/AppError';
import { ClientesRepository } from '../repositories/ClientesRepository';

interface ICreateClienteRequest {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string | null;
  leadId?: string | null;
  consultorId?: string | null;
}

export class CreateClienteService {
  private clientesRepository: ClientesRepository;

  constructor() {
    this.clientesRepository = new ClientesRepository();
  }

  async execute({
    nome,
    email,
    telefone,
    cpf = null,
    leadId = null,
    consultorId = null,
  }: ICreateClienteRequest) {
    if (!nome || !email || !telefone) {
      throw new AppError('Nome, e-mail e telefone são obrigatórios.', 400);
    }

    if (await this.clientesRepository.findByEmail(email)) {
      throw new AppError('Já existe um cliente com este e-mail.', 400);
    }

    const cliente = await this.clientesRepository.create({
      nome_cliente: nome,
      email_cliente: email,
      telefone_cliente: telefone,
      cpf_cliente: cpf,
      id_lead_principal: leadId,
      id_consultor: consultorId,
    });

    if (leadId) {
      await this.clientesRepository.linkLeadToCliente(leadId, cliente.id_cliente);
    }

    return {
      id: cliente.id_cliente,
      name: cliente.nome_cliente,
      email: cliente.email_cliente,
      phone: cliente.telefone_cliente,
      leadId: cliente.id_lead_principal ?? null,
      consultorId: cliente.id_consultor ?? null,
    };
  }
}
