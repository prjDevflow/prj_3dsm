import { Request, Response } from 'express';
import { prisma } from '../../shared/infra/prisma/client';


const DEFAULT_CAPABILITIES = {
  pages:   { dashboard: true, leads: true, clients: false, logs: false, admin: false, settings: false, users: false, teams: false },
  actions: { export_csv: false, import_csv: false, create_lead: false, delete_lead: false, view_all_leads: false, create_user: false, delete_user: false },
};

function mapPapel(p: any, userCount: number) {
  return {
    id:           p.id_papel,
    nome:         p.nome_papel,
    descricao:    p.descricao ?? '',
    cor:          p.cor ?? '#17364F',
    editavel:     p.editavel ?? true,
    capabilities: p.capabilities ?? DEFAULT_CAPABILITIES,
    userCount,
  };
}

export class PapeisController {
  async list(_req: Request, res: Response): Promise<Response> {
    const papeis = await prisma.papel.findMany({ orderBy: { nome_papel: 'asc' } });
    const counts = await prisma.usuario.groupBy({ by: ['id_papel'], _count: { id_usuario: true } });
    const countMap = Object.fromEntries(counts.map((c) => [c.id_papel, c._count.id_usuario]));
    return res.json(papeis.map((p) => mapPapel(p, countMap[p.id_papel] ?? 0)));
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { nome, descricao, cor, basePapelId, capabilities } = req.body;
    if (!nome?.trim()) return res.status(400).json({ error: 'Nome é obrigatório.' });

    const exists = await prisma.papel.findUnique({ where: { nome_papel: nome.trim().toUpperCase() } });
    if (exists) return res.status(400).json({ error: 'Já existe um perfil com este nome.' });

    let caps = capabilities ?? DEFAULT_CAPABILITIES;
    if (basePapelId) {
      const base = await prisma.papel.findUnique({ where: { id_papel: basePapelId } });
      if (base) caps = { ...(base.capabilities as any), ...caps };
    }

    const papel = await prisma.papel.create({
      data: {
        nome_papel:   nome.trim().toUpperCase(),
        descricao:    descricao?.trim() ?? null,
        cor:          cor ?? '#17364F',
        editavel:     true,
        capabilities: caps,
      },
    });

    return res.status(201).json(mapPapel(papel, 0));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { descricao, cor, capabilities, nome } = req.body;

    const papel = await prisma.papel.findUnique({ where: { id_papel: id } });
    if (!papel) return res.status(404).json({ error: 'Perfil não encontrado.' });

    const updated = await prisma.papel.update({
      where: { id_papel: id },
      data: {
        ...(papel.editavel && nome ? { nome_papel: nome.trim().toUpperCase() } : {}),
        ...(descricao !== undefined ? { descricao: descricao.trim() } : {}),
        ...(cor        ? { cor }          : {}),
        ...(capabilities ? { capabilities } : {}),
      },
    });

    const count = await prisma.usuario.count({ where: { id_papel: id } });
    return res.json(mapPapel(updated, count));
  }

  async remove(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const papel = await prisma.papel.findUnique({ where: { id_papel: id } });
    if (!papel) return res.status(404).json({ error: 'Perfil não encontrado.' });
    if (!papel.editavel) return res.status(400).json({ error: 'Perfis do sistema não podem ser excluídos.' });

    const userCount = await prisma.usuario.count({ where: { id_papel: id } });
    if (userCount > 0) return res.status(400).json({ error: `Existem ${userCount} usuário(s) com este perfil. Reatribua-os antes de excluir.` });

    await prisma.papel.delete({ where: { id_papel: id } });
    return res.status(204).send();
  }

  // GET /papeis/user/:id — capabilities mergeadas para um usuário
  async userCapabilities(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: id },
      include: { papel: true },
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const roleCaps  = (user.papel.capabilities as any) ?? DEFAULT_CAPABILITIES;
    const extras    = (user.permissoes_extras as any)  ?? {};
    const merged = {
      pages:   { ...roleCaps.pages,   ...(extras.pages   ?? {}) },
      actions: { ...roleCaps.actions, ...(extras.actions ?? {}) },
    };

    return res.json({ capabilities: merged, extras });
  }

  // PUT /papeis/user/:id/extras — salva overrides individuais
  async updateUserExtras(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { pages, actions } = req.body;

    await prisma.usuario.update({
      where: { id_usuario: id },
      data: { permissoes_extras: { pages: pages ?? {}, actions: actions ?? {} } },
    });

    return res.json({ ok: true });
  }
}
