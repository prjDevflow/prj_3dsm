import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

function diasAtras(dias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log(' Iniciando a semeadura completa da base de dados...');

  // 1. Papéis
  const papeisData = ['ADMIN', 'GERENTE_GERAL', 'GERENTE', 'ATENDENTE'];
  const papeisCriados: Record<string, string> = {};
  for (const nome of papeisData) {
    const papel = await prisma.papel.upsert({ where: { nome_papel: nome }, update: {}, create: { nome_papel: nome } });
    papeisCriados[nome] = papel.id_papel;
  }
  console.log(' Papéis criados.');

  // 2. Status
  const statusData = ['ABERTA', 'GANHA', 'PERDIDA', 'CANCELADA'];
  const statusCriados: Record<string, string> = {};
  for (const s of statusData) {
    const st = await prisma.status.upsert({ where: { nome_status: s }, update: {}, create: { nome_status: s } });
    statusCriados[s] = st.id_status;
  }
  console.log(' Status criados.');

  // 3. Estágios
  const estagiosData = ['primeiro_contato', 'qualificacao', 'proposta_enviada', 'negociacao', 'fechamento'];
  const estagiosCriados: Record<string, string> = {};
  for (const e of estagiosData) {
    const est = await prisma.estagio.upsert({ where: { nome_estagio: e }, update: {}, create: { nome_estagio: e } });
    estagiosCriados[e] = est.id_estagio;
  }
  console.log(' Estágios criados.');

  // 4. Origens
  const origensData = ['WhatsApp', 'Instagram', 'Site', 'Indicação'];
  const origensCriadas: Record<string, string> = {};
  for (const o of origensData) {
    const orig = await prisma.origem.upsert({ where: { nome_origem: o }, update: {}, create: { nome_origem: o } });
    origensCriadas[o] = orig.id_origem;
  }
  console.log(' Origens criadas.');

  // 5. Lojas
  const lojasData = ['Matriz Jacareí', 'Filial São José dos Campos'];
  const lojasCriadas: Record<string, string> = {};
  for (const l of lojasData) {
    let loja = await prisma.loja.findFirst({ where: { nome_loja: l } });
    if (!loja) loja = await prisma.loja.create({ data: { nome_loja: l } });
    lojasCriadas[l] = loja.id_loja;
  }
  console.log(' Lojas criadas.');

  // 6. Equipes
  const equipesCriadas: Record<string, string> = {};
  for (const nome of ['Equipe Alpha', 'Equipe Beta']) {
    let eq = await prisma.equipe.findFirst({ where: { nome_equipe: nome } });
    if (!eq) eq = await prisma.equipe.create({ data: { nome_equipe: nome } });
    equipesCriadas[nome] = eq.id_equipe;
  }
  console.log(' Equipes criadas.');

  // 7. Usuários
  const senhaHash = await hash('123', 8);

  const usuariosData = [
    { nome: 'Administrador do Sistema', email: 'admin@1000valle.com.br', papel: 'ADMIN', equipe: null },
    { nome: 'Gerente Geral',            email: 'gerente.geral@1000valle.com.br', papel: 'GERENTE_GERAL', equipe: null },
    { nome: 'Carlos Gerente',           email: 'carlos@1000valle.com.br', papel: 'GERENTE', equipe: 'Equipe Alpha' },
    { nome: 'Fernanda Gerente',         email: 'fernanda@1000valle.com.br', papel: 'GERENTE', equipe: 'Equipe Beta' },
    { nome: 'Ana Souza',                email: 'ana@1000valle.com.br', papel: 'ATENDENTE', equipe: 'Equipe Alpha' },
    { nome: 'Bruno Lima',               email: 'bruno@1000valle.com.br', papel: 'ATENDENTE', equipe: 'Equipe Alpha' },
    { nome: 'Carla Mendes',             email: 'carla@1000valle.com.br', papel: 'ATENDENTE', equipe: 'Equipe Beta' },
    { nome: 'Diego Rocha',              email: 'diego@1000valle.com.br', papel: 'ATENDENTE', equipe: 'Equipe Beta' },
  ];

  const usuariosCriados: Record<string, string> = {};
  for (const u of usuariosData) {
    const usuario = await prisma.usuario.upsert({
      where: { email_usuario: u.email },
      update: {},
      create: {
        nome_usuario: u.nome,
        email_usuario: u.email,
        senha_hash_usuario: senhaHash,
        id_papel: papeisCriados[u.papel],
        id_equipe: u.equipe ? equipesCriadas[u.equipe] : null,
      },
    });
    usuariosCriados[u.nome] = usuario.id_usuario;
  }
  console.log(' Usuários criados.');

  // 8. Clientes + Leads + Negociações
  const atendentes = ['Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Diego Rocha'];
  const origens = Object.keys(origensCriadas);
  const lojas = Object.keys(lojasCriadas);
  const importancias = ['frio', 'morno', 'quente'];

  // Distribuição: 40% ABERTA, 30% GANHA, 20% PERDIDA, 10% CANCELADA
  const statusDistribuicao = [
    ...Array(12).fill('ABERTA'),
    ...Array(9).fill('GANHA'),
    ...Array(6).fill('PERDIDA'),
    ...Array(3).fill('CANCELADA'),
  ];

  // Estágios para leads abertos
  const estagiosAbertos = ['primeiro_contato', 'qualificacao', 'proposta_enviada', 'negociacao', 'fechamento'];

  const clientesBase = [
    { nome: 'Roberto Alves',    telefone: '12991110001', email: 'roberto.alves@email.com' },
    { nome: 'Mariana Costa',    telefone: '12991110002', email: 'mariana.costa@email.com' },
    { nome: 'Felipe Santos',    telefone: '12991110003', email: 'felipe.santos@email.com' },
    { nome: 'Juliana Ferreira', telefone: '12991110004', email: 'juliana.ferreira@email.com' },
    { nome: 'Ricardo Oliveira', telefone: '12991110005', email: 'ricardo.oliveira@email.com' },
    { nome: 'Patrícia Nunes',   telefone: '12991110006', email: 'patricia.nunes@email.com' },
    { nome: 'Eduardo Teixeira', telefone: '12991110007', email: 'eduardo.teixeira@email.com' },
    { nome: 'Camila Barbosa',   telefone: '12991110008', email: 'camila.barbosa@email.com' },
    { nome: 'Lucas Pereira',    telefone: '12991110009', email: 'lucas.pereira@email.com' },
    { nome: 'Aline Carvalho',   telefone: '12991110010', email: 'aline.carvalho@email.com' },
    { nome: 'Thiago Monteiro',  telefone: '12991110011', email: 'thiago.monteiro@email.com' },
    { nome: 'Bruna Gomes',      telefone: '12991110012', email: 'bruna.gomes@email.com' },
    { nome: 'Gustavo Ribeiro',  telefone: '12991110013', email: 'gustavo.ribeiro@email.com' },
    { nome: 'Larissa Dias',     telefone: '12991110014', email: 'larissa.dias@email.com' },
    { nome: 'André Rodrigues',  telefone: '12991110015', email: 'andre.rodrigues@email.com' },
    { nome: 'Priscila Azevedo', telefone: '12991110016', email: 'priscila.azevedo@email.com' },
    { nome: 'Vinicius Castro',  telefone: '12991110017', email: 'vinicius.castro@email.com' },
    { nome: 'Tatiana Moreira',  telefone: '12991110018', email: 'tatiana.moreira@email.com' },
    { nome: 'Rodrigo Lopes',    telefone: '12991110019', email: 'rodrigo.lopes@email.com' },
    { nome: 'Daniela Freitas',  telefone: '12991110020', email: 'daniela.freitas@email.com' },
    { nome: 'Marcelo Cunha',    telefone: '12991110021', email: 'marcelo.cunha@email.com' },
    { nome: 'Simone Pinto',     telefone: '12991110022', email: 'simone.pinto@email.com' },
    { nome: 'Fábio Araújo',     telefone: '12991110023', email: 'fabio.araujo@email.com' },
    { nome: 'Renata Melo',      telefone: '12991110024', email: 'renata.melo@email.com' },
    { nome: 'Alexandre Lima',   telefone: '12991110025', email: 'alexandre.lima@email.com' },
    { nome: 'Beatriz Farias',   telefone: '12991110026', email: 'beatriz.farias@email.com' },
    { nome: 'Henrique Sousa',   telefone: '12991110027', email: 'henrique.sousa@email.com' },
    { nome: 'Vanessa Xavier',   telefone: '12991110028', email: 'vanessa.xavier@email.com' },
    { nome: 'Otávio Brito',     telefone: '12991110029', email: 'otavio.brito@email.com' },
    { nome: 'Isabela Correia',  telefone: '12991110030', email: 'isabela.correia@email.com' },
  ];

  const motivosPerdaData = ['Preço alto', 'Comprou concorrente', 'Sem interesse', 'Sem retorno'];

  let leadsCount = 0;
  for (let i = 0; i < clientesBase.length; i++) {
    const cb = clientesBase[i];

    let cliente = await prisma.cliente.findFirst({ where: { email_cliente: cb.email } });
    if (!cliente) {
      cliente = await prisma.cliente.create({
        data: {
          nome_cliente: cb.nome,
          telefone_cliente: cb.telefone,
          email_cliente: cb.email,
        },
      });
    }

    const atendente = pick(atendentes);
    const origem = pick(origens);
    const loja = pick(lojas);
    const diasCriacao = Math.floor(Math.random() * 60); // últimos 60 dias
    const statusNome = statusDistribuicao[i % statusDistribuicao.length];
    const importancia = pick(importancias);

    // Idempotente: só cria lead se ainda não existe para este cliente
    const leadExistente = await prisma.lead.findFirst({ where: { id_cliente: cliente.id_cliente } });
    if (leadExistente) continue;

    const lead = await prisma.lead.create({
      data: {
        id_cliente: cliente.id_cliente,
        id_usuario: usuariosCriados[atendente],
        id_loja: lojasCriadas[loja],
        id_origem: origensCriadas[origem],
        data_criacao_lead: diasAtras(diasCriacao),
      },
    });
    leadsCount++;

    // Determina estágio conforme status
    let estagio: string;
    if (statusNome === 'GANHA') {
      estagio = 'fechamento';
    } else if (statusNome === 'PERDIDA' || statusNome === 'CANCELADA') {
      estagio = pick(['negociacao', 'proposta_enviada', 'qualificacao']);
    } else {
      estagio = pick(estagiosAbertos);
    }

    const motivo = (statusNome === 'PERDIDA') ? pick(motivosPerdaData) : null;

    await prisma.negociacao.create({
      data: {
        id_lead: lead.id_lead,
        importancia_negociacao: importancia,
        estado_abertura_negociacao: statusNome === 'ABERTA',
        motivo_finalizacao_negociacao: motivo,
        data_criacao_negociacao: diasAtras(diasCriacao),
        id_estagio: estagiosCriados[estagio],
        id_status: statusCriados[statusNome],
      },
    });
  }

  if (leadsCount > 0) {
    console.log(` ${leadsCount} leads e negociações criados.`);
  } else {
    console.log(' Leads já existem, seed ignorado.');
  }
  console.log(' Semeadura concluída com sucesso!');
  console.log('');
  console.log(' Logins disponíveis (senha: 123):');
  console.log('   admin@1000valle.com.br         → ADMIN');
  console.log('   gerente.geral@1000valle.com.br → GERENTE_GERAL');
  console.log('   carlos@1000valle.com.br        → GERENTE (Equipe Alpha)');
  console.log('   fernanda@1000valle.com.br      → GERENTE (Equipe Beta)');
  console.log('   ana@1000valle.com.br           → ATENDENTE');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('Erro durante o seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
