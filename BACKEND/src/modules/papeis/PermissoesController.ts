import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PermissoesController {
  async list(_req: Request, res: Response): Promise<Response> {
    const perms = await prisma.permissaoSistema.findMany({ orderBy: [{ categoria: 'asc' }, { nome: 'asc' }] });
    return res.json(perms.map(p => ({
      id: p.id_permissao, chave: p.chave, nome: p.nome,
      descricao: p.descricao ?? '', categoria: p.categoria, ativa: p.ativa,
    })));
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { chave, nome, descricao, categoria } = req.body;
    if (!chave?.trim() || !nome?.trim() || !categoria?.trim())
      return res.status(400).json({ error: 'Chave, nome e categoria são obrigatórios.' });

    const exists = await prisma.permissaoSistema.findUnique({ where: { chave: chave.trim().toLowerCase() } });
    if (exists) return res.status(400).json({ error: 'Já existe uma permissão com esta chave.' });

    const perm = await prisma.permissaoSistema.create({
      data: { chave: chave.trim().toLowerCase(), nome: nome.trim(), descricao: descricao?.trim() ?? null, categoria },
    });
    return res.status(201).json({ id: perm.id_permissao, chave: perm.chave, nome: perm.nome, descricao: perm.descricao ?? '', categoria: perm.categoria, ativa: perm.ativa });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { nome, descricao, ativa } = req.body;
    const perm = await prisma.permissaoSistema.update({
      where: { id_permissao: id },
      data: { ...(nome ? { nome } : {}), ...(descricao !== undefined ? { descricao } : {}), ...(ativa !== undefined ? { ativa } : {}) },
    });
    return res.json({ id: perm.id_permissao, chave: perm.chave, nome: perm.nome, descricao: perm.descricao ?? '', categoria: perm.categoria, ativa: perm.ativa });
  }

  async remove(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await prisma.permissaoSistema.delete({ where: { id_permissao: id } });
    return res.status(204).send();
  }
}
