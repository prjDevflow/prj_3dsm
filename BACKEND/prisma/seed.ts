import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando a semeadura completa da base de dados...');

  // 1. Papéis (Roles)
  const papeisData = ['ADMIN', 'GERENTE_GERAL', 'GERENTE', 'ATENDENTE'];
  const papeisCriados: Record<string, string> = {};
  for (const nome of papeisData) {
    const papel = await prisma.papel.upsert({ where: { nome_papel: nome }, update: {}, create: { nome_papel: nome } });
    papeisCriados[nome] = papel.id_papel;
  }
  console.log(' Papéis criados.');

  // 2. Status Iniciais (Leads e Negociações)
  const statusData = ['NOVO', 'EM_ATENDIMENTO', 'FINALIZADO', 'ABERTA', 'GANHA', 'PERDIDA'];
  for (const s of statusData) {
    await prisma.status.upsert({ where: { nome_status: s }, update: {}, create: { nome_status: s } });
  }
  console.log(' Status padronizados criados.');

  // 3. Estágios Iniciais (O QUE FALTAVA! )
  const estagiosData = ['Contato Inicial', 'Apresentação', 'Proposta', 'Fechamento'];
  for (const e of estagiosData) {
    await prisma.estagio.upsert({ where: { nome_estagio: e }, update: {}, create: { nome_estagio: e } });
  }
  console.log(' Estágios de negociação criados.');

  // 4. Origens Iniciais
  const origensData = ['WhatsApp', 'Instagram', 'Site', 'Indicação'];
  for (const o of origensData) {
    await prisma.origem.upsert({ where: { nome_origem: o }, update: {}, create: { nome_origem: o } });
  }
  console.log(' Origens iniciais criadas.');

  // 5. Lojas Iniciais
  const lojasData = ['Matriz Jacareí', 'Filial São José dos Campos'];
  for (const l of lojasData) {
    const existe = await prisma.loja.findFirst({ where: { nome_loja: l } });
    if (!existe) await prisma.loja.create({ data: { nome_loja: l } });
  }
  console.log(' Lojas iniciais criadas.');

  // 6. Utilizador Administrador
  const adminEmail = 'admin@1000valle.com.br';
  const adminHash = await hash('123', 8);

  await prisma.usuario.upsert({
    where: { email_usuario: adminEmail },
    update: {},
    create: {
      nome_usuario: 'Administrador do Sistema',
      email_usuario: adminEmail,
      senha_hash_usuario: adminHash,
      id_papel: papeisCriados['ADMIN'],
    },
  });
  console.log(' Administrador criado (admin@1000valle.com.br / 123).');
  console.log(' Semeadura concluída com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Erro durante o seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });