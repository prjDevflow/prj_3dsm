import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../components/Header";
import api from "../../services/instanceApi";
import { useToast } from "../../components/Toast";
import { UsersService } from "../../services/implementations/UsersService";
import { IUser } from "../../services/IUsersService";
import {
  ShieldCheck, Plus, Pencil, Trash2, Users, Loader2, Check, X,
  Search, Save, Lock, ChevronLeft, ChevronRight,
  LayoutDashboard, FileText, Settings, UserCheck, Building2,
  BarChart2, Zap, Eye, ToggleLeft, ToggleRight, Tag,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Permissao {
  id: string; chave: string; nome: string; descricao: string;
  categoria: "pages" | "actions"; ativa: boolean;
}
interface Papel {
  id: string; nome: string; descricao: string; cor: string;
  editavel: boolean; userCount: number;
  capabilities: { pages: Record<string, boolean>; actions: Record<string, boolean> };
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const COLORS = ["#7C3AED","#4F46E5","#2563EB","#0891B2","#059669","#D97706","#DC2626","#DB2777","#64748B","#17364F"];
const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador", GERENTE_GERAL: "Gerente Geral",
  GERENTE: "Gerente", ATENDENTE: "Atendente",
};
const CAT_ICONS: Record<string, any> = { pages: Eye, actions: Zap };
const CAT_LABELS: Record<string, string> = { pages: "Acesso a Páginas", actions: "Ações" };
const USERS_PER_PAGE = 8;
const usersService = new UsersService();

// ─── PermissaoModal ───────────────────────────────────────────────────────────
function PermissaoModal({ perm, onClose, onSave }: {
  perm: Permissao | null; onClose: () => void; onSave: () => void;
}) {
  const toast = useToast();
  const isNew = !perm;
  const [chave, setChave]       = useState(perm?.chave ?? "");
  const [nome, setNome]         = useState(perm?.nome ?? "");
  const [descricao, setDesc]    = useState(perm?.descricao ?? "");
  const [categoria, setCat]     = useState<"pages"|"actions">(perm?.categoria ?? "actions");
  const [saving, setSaving]     = useState(false);

  const handleSave = async () => {
    if (!nome.trim() || (isNew && !chave.trim())) { toast.error("Nome e chave são obrigatórios."); return; }
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/permissoes", { chave, nome, descricao, categoria });
        toast.success("Permissão criada!");
      } else {
        await api.put(`/permissoes/${perm!.id}`, { nome, descricao });
        toast.success("Permissão atualizada!");
      }
      onSave(); onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao salvar.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{isNew ? "Nova permissão" : `Editar — ${perm!.nome}`}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          {isNew && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Chave (identificador)</label>
                <input value={chave} onChange={e => setChave(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                  className="input w-full font-mono text-sm" placeholder="ex: ver_relatorios" />
                <p className="text-xs text-slate-400 mt-1">Sem espaços, somente letras minúsculas e underscore.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Categoria</label>
                <div className="flex gap-2">
                  {(["pages","actions"] as const).map(c => (
                    <button key={c} onClick={() => setCat(c)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        categoria === c ? "border-[var(--color-primary)] bg-[var(--color-primary-10)] text-[var(--color-primary)]" : "border-slate-200 text-slate-500"
                      }`}>
                      {c === "pages" ? <Eye size={14} /> : <Zap size={14} />}
                      {CAT_LABELS[c]}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome</label>
            <input value={nome} onChange={e => setNome(e.target.value)} className="input w-full" placeholder="Ex: Ver Relatórios Avançados" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Descrição</label>
            <input value={descricao} onChange={e => setDesc(e.target.value)} className="input w-full" placeholder="O que esta permissão permite fazer" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isNew ? "Criar" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RoleModal ────────────────────────────────────────────────────────────────
function RoleModal({ papel, papeis, permissoes, onClose, onSave }: {
  papel: Papel | null; papeis: Papel[]; permissoes: Permissao[];
  onClose: () => void; onSave: () => void;
}) {
  const toast  = useToast();
  const isNew  = !papel;
  const [nome, setNome]     = useState(papel?.nome ?? "");
  const [desc, setDesc]     = useState(papel?.descricao ?? "");
  const [cor, setCor]       = useState(papel?.cor ?? "#17364F");
  const [baseId, setBaseId] = useState("");
  const [caps, setCaps]     = useState<{ pages: Record<string,boolean>; actions: Record<string,boolean> }>(
    papel?.capabilities ?? { pages: {}, actions: {} }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew && baseId) {
      const base = papeis.find(p => p.id === baseId);
      if (base) setCaps(JSON.parse(JSON.stringify(base.capabilities)));
    }
  }, [baseId]);

  const toggle = (cat: "pages" | "actions", key: string) =>
    setCaps(c => ({ ...c, [cat]: { ...c[cat], [key]: !c[cat][key] } }));

  const activePerms = permissoes.filter(p => p.ativa);
  const pages   = activePerms.filter(p => p.categoria === "pages");
  const actions = activePerms.filter(p => p.categoria === "actions");

  const handleSave = async () => {
    if (isNew && !nome.trim()) { toast.error("Nome é obrigatório."); return; }
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/papeis", { nome, descricao: desc, cor, capabilities: caps, basePapelId: baseId || undefined });
        toast.success("Perfil criado!");
      } else {
        await api.put(`/papeis/${papel!.id}`, { nome: papel!.editavel ? nome : undefined, descricao: desc, cor, capabilities: caps });
        toast.success("Perfil atualizado!");
      }
      onSave(); onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao salvar.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: cor }}>
              {(isNew ? nome || "?" : ROLE_LABELS[papel!.nome] ?? papel!.nome).charAt(0)}
            </div>
            <h2 className="font-semibold text-slate-800">
              {isNew ? "Criar perfil" : `Editar — ${ROLE_LABELS[papel!.nome] ?? papel!.nome}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} disabled={!isNew && !papel?.editavel}
                className="input w-full disabled:opacity-60" placeholder="Ex: Supervisor" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Cor</label>
              <div className="flex gap-1.5 flex-wrap mt-0.5">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setCor(c)}
                    className={`w-7 h-7 rounded-lg border-2 transition-all ${cor === c ? "border-slate-700 scale-110" : "border-transparent"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Descrição</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} className="input w-full"
              placeholder="Descreva as responsabilidades deste perfil" />
          </div>

          {isNew && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Herdar permissões de</label>
              <select value={baseId} onChange={e => setBaseId(e.target.value)} className="input w-full">
                <option value="">Começar do zero</option>
                {papeis.map(p => <option key={p.id} value={p.id}>{ROLE_LABELS[p.nome] ?? p.nome}</option>)}
              </select>
            </div>
          )}

          {/* Páginas */}
          {pages.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Eye size={13} /> Acesso a páginas
                <span className="font-normal text-slate-400 normal-case">
                  ({Object.entries(caps.pages).filter(([,v]) => v).length}/{pages.length} ativas)
                </span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pages.map(p => (
                  <label key={p.chave} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    caps.pages[p.chave] ? "border-[var(--color-primary)] bg-[var(--color-primary-10)]" : "border-slate-200 hover:border-slate-300"
                  }`}>
                    <input type="checkbox" className="sr-only" checked={!!caps.pages[p.chave]} onChange={() => toggle("pages", p.chave)} />
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${caps.pages[p.chave] ? "bg-[var(--color-primary)]" : "bg-slate-200"}`}>
                      {caps.pages[p.chave] && <Check size={11} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{p.nome}</p>
                      {p.descricao && <p className="text-xs text-slate-400 mt-0.5 leading-snug">{p.descricao}</p>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          {actions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Zap size={13} /> Ações permitidas
                <span className="font-normal text-slate-400 normal-case">
                  ({Object.entries(caps.actions).filter(([,v]) => v).length}/{actions.length} ativas)
                </span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {actions.map(a => (
                  <label key={a.chave} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    caps.actions[a.chave] ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"
                  }`}>
                    <input type="checkbox" className="sr-only" checked={!!caps.actions[a.chave]} onChange={() => toggle("actions", a.chave)} />
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${caps.actions[a.chave] ? "bg-emerald-500" : "bg-slate-200"}`}>
                      {caps.actions[a.chave] && <Check size={11} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{a.nome}</p>
                      {a.descricao && <p className="text-xs text-slate-400 mt-0.5 leading-snug">{a.descricao}</p>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isNew ? "Criar perfil" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── UserRoleModal (apenas trocar perfil) ────────────────────────────────────
function UserRoleModal({ user, papeis, onClose, onSave }: {
  user: IUser; papeis: Papel[]; onClose: () => void; onSave: () => void;
}) {
  const toast = useToast();
  const currentPapel = papeis.find(p => p.nome === user.role.toUpperCase());
  const [papelId, setPapelId] = useState(currentPapel?.id ?? "");
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    if (!papelId) { toast.error("Selecione um perfil."); return; }
    setSaving(true);
    try {
      await api.put(`/users/${user.id}`, { role: papeis.find(p => p.id === papelId)?.nome });
      toast.success(`Perfil de ${user.name} atualizado!`);
      onSave(); onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao salvar.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-800">Alterar perfil</h2>
            <p className="text-xs text-slate-400 mt-0.5">{user.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-3">
          {papeis.map(p => (
            <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
              papelId === p.id ? "border-[var(--color-primary)] bg-[var(--color-primary-10)]" : "border-slate-200 hover:border-slate-300"
            }`}>
              <input type="radio" name="papel" value={p.id} checked={papelId === p.id}
                onChange={() => setPapelId(p.id)} className="sr-only" />
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: papelId === p.id ? p.cor : "#CBD5E1" }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{ROLE_LABELS[p.nome] ?? p.nome}</p>
                {p.descricao && <p className="text-xs text-slate-400">{p.descricao}</p>}
              </div>
              {papelId === p.id && <Check size={16} className="text-[var(--color-primary)]" />}
            </label>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const AdminPage = () => {
  const { user: me } = useAuth();
  const toast = useToast();

  const [tab, setTab]                 = useState<"permissoes"|"perfis"|"usuarios">("permissoes");
  const [permissoes, setPermissoes]   = useState<Permissao[]>([]);
  const [papeis, setPapeis]           = useState<Papel[]>([]);
  const [users, setUsers]             = useState<IUser[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [search, setSearch]           = useState("");
  const [userPage, setUserPage]       = useState(1);

  // Modais
  const [editPerm, setEditPerm]       = useState<Permissao | null | "new">(null);
  const [editPapel, setEditPapel]     = useState<Papel | null | "new">(null);
  const [editUserRole, setEditUserRole] = useState<IUser | null>(null);
  const [deletePermId, setDeletePermId] = useState<string | null>(null);
  const [deletePapelId, setDeletePapelId] = useState<string | null>(null);

  const loadPermissoes = async () => { const { data } = await api.get<Permissao[]>("/permissoes"); setPermissoes(data); };
  const loadPapeis     = async () => { const { data } = await api.get<Papel[]>("/papeis"); setPapeis(data); };
  const loadUsers      = async () => { const res = await usersService.getUsers({ limit: 200 }); setUsers(res.data); };

  const load = async () => {
    setIsLoading(true);
    try { await Promise.all([loadPermissoes(), loadPapeis(), loadUsers()]); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const togglePerm = async (perm: Permissao) => {
    await api.put(`/permissoes/${perm.id}`, { ativa: !perm.ativa });
    await loadPermissoes();
    toast.success(perm.ativa ? "Permissão desativada." : "Permissão ativada.");
  };

  const deletePerm = async (id: string) => {
    try { await api.delete(`/permissoes/${id}`); toast.success("Permissão excluída."); setDeletePermId(null); await loadPermissoes(); }
    catch (err: any) { toast.error(err?.response?.data?.error ?? "Erro ao excluir."); setDeletePermId(null); }
  };

  const deletePapel = async (id: string) => {
    try { await api.delete(`/papeis/${id}`); toast.success("Perfil excluído."); setDeletePapelId(null); await loadPapeis(); }
    catch (err: any) { toast.error(err?.response?.data?.error ?? "Erro ao excluir."); setDeletePapelId(null); }
  };

  const filteredUsers = useMemo(() =>
    !search ? users : users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
  , [users, search]);

  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const pagedUsers = filteredUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

  if (me?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Lock size={40} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">Acesso restrito a administradores.</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "permissoes", label: "Permissões",    icon: Tag },
    { key: "perfis",     label: "Perfis",         icon: ShieldCheck },
    { key: "usuarios",   label: "Usuários",       icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Painel Administrativo</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {permissoes.filter(p => p.ativa).length} permissões ativas · {papeis.length} perfis · {users.length} usuários
              </p>
            </div>
          </div>
          <div>
            {tab === "permissoes" && (
              <button onClick={() => setEditPerm("new")} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Nova permissão
              </button>
            )}
            {tab === "perfis" && (
              <button onClick={() => setEditPapel("new")} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Criar perfil
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" /></div>
        ) : tab === "permissoes" ? (

          /* ── Aba Permissões ─────────────────────────────────── */
          <div className="space-y-6">
            {(["pages","actions"] as const).map(cat => {
              const catPerms = permissoes.filter(p => p.categoria === cat);
              const Icon = CAT_ICONS[cat];
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={15} className="text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-700">{CAT_LABELS[cat]}</h3>
                    <span className="text-xs text-slate-400">({catPerms.filter(p => p.ativa).length}/{catPerms.length} ativas)</span>
                  </div>
                  <div className="card overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Permissão</th>
                          <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Chave</th>
                          <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                          <th className="px-5 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {catPerms.map(perm => (
                          <tr key={perm.id} className={`transition-colors hover:bg-slate-50 ${!perm.ativa ? "opacity-50" : ""}`}>
                            <td className="px-5 py-3">
                              <p className="text-sm font-medium text-slate-800">{perm.nome}</p>
                              {perm.descricao && <p className="text-xs text-slate-400 mt-0.5">{perm.descricao}</p>}
                            </td>
                            <td className="px-5 py-3">
                              <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{perm.chave}</code>
                            </td>
                            <td className="px-5 py-3">
                              <button onClick={() => togglePerm(perm)}
                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${perm.ativa ? "text-emerald-600" : "text-slate-400"}`}>
                                {perm.ativa
                                  ? <><ToggleRight size={16} /> Ativa</>
                                  : <><ToggleLeft size={16} /> Inativa</>}
                              </button>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => setEditPerm(perm)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 transition-colors">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => setDeletePermId(perm.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

        ) : tab === "perfis" ? (

          /* ── Aba Perfis ─────────────────────────────────────── */
          papeis.length === 0 ? (
            <div className="card p-12 text-center">
              <ShieldCheck size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Nenhum perfil encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {papeis.map(p => {
                const pagesOn   = Object.entries(p.capabilities.pages  ).filter(([,v]) => v).map(([k]) => k);
                const actionsOn = Object.entries(p.capabilities.actions).filter(([,v]) => v).map(([k]) => k);
                return (
                  <div key={p.id} className="card overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    <div className="h-1.5 flex-shrink-0" style={{ background: p.cor }} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{ background: p.cor }}>
                            {(ROLE_LABELS[p.nome] ?? p.nome).charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{ROLE_LABELS[p.nome] ?? p.nome}</p>
                            {!p.editavel && <span className="text-[10px] text-slate-400">Sistema</span>}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setEditPapel(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 transition-colors"><Pencil size={14} /></button>
                          {p.editavel && <button onClick={() => setDeletePapelId(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"><Trash2 size={14} /></button>}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 flex-1 leading-relaxed">{p.descricao || "Sem descrição."}</p>

                      {/* Permissões em chips */}
                      <div className="space-y-2 mb-3">
                        {pagesOn.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Páginas</p>
                            <div className="flex flex-wrap gap-1">
                              {pagesOn.map(k => {
                                const pm = permissoes.find(x => x.chave === k);
                                return pm ? (
                                  <span key={k} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium text-white" style={{ background: p.cor + "BB" }}>
                                    {pm.nome.replace("Ver ", "").replace("Gerenciar ", "")}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                        {actionsOn.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Ações</p>
                            <div className="flex flex-wrap gap-1">
                              {actionsOn.map(k => {
                                const pm = permissoes.find(x => x.chave === k);
                                return pm ? (
                                  <span key={k} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                                    {pm.nome}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1"><Users size={11} /> {p.userCount} usuário{p.userCount !== 1 ? "s" : ""}</span>
                        <span><Lock size={11} className="inline mr-1" />{pagesOn.length}p · {actionsOn.length}a</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )

        ) : (

          /* ── Aba Usuários ────────────────────────────────────── */
          <div>
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input placeholder="Buscar por nome..."
                value={search}
                onChange={e => { setSearch(e.target.value); setUserPage(1); }}
                className="input pl-9 w-full max-w-xs text-sm" />
            </div>

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Usuário</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Perfil atual</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Alterar perfil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedUsers.map(u => {
                    const papel = papeis.find(p => p.nome === u.role.toUpperCase());
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {(() => {
                              const av = localStorage.getItem(`user_avatar_${u.id}`);
                              return av ? (
                                <img src={av} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                  style={{ background: papel?.cor ?? "#64748B" }}>
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                              );
                            })()}
                            <div>
                              <p className="text-sm font-medium text-slate-800">{u.name}</p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ background: papel?.cor ?? "#64748B" }}>
                            {ROLE_LABELS[papel?.nome ?? ""] ?? papel?.nome ?? u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {u.active !== false
                            ? <span className="flex items-center gap-1 text-xs text-emerald-600"><Check size={11} /> Ativo</span>
                            : <span className="flex items-center gap-1 text-xs text-slate-400"><X size={11} /> Inativo</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {u.id !== me?.id && (
                            <button onClick={() => setEditUserRole(u)}
                              className="text-xs font-medium text-[var(--color-primary)] hover:underline">
                              Alterar perfil
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {filteredUsers.length === 0 ? "Nenhum resultado"
                    : `${(userPage-1)*USERS_PER_PAGE+1}–${Math.min(userPage*USERS_PER_PAGE, filteredUsers.length)} de ${filteredUsers.length} usuários`}
                </p>
                {totalUserPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => setUserPage(p => p-1)} disabled={userPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs text-slate-500 px-2">{userPage} / {totalUserPages}</span>
                    <button onClick={() => setUserPage(p => p+1)} disabled={userPage === totalUserPages}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modais */}
      {editPerm !== null && (
        <PermissaoModal perm={editPerm === "new" ? null : editPerm} onClose={() => setEditPerm(null)} onSave={loadPermissoes} />
      )}
      {editPapel !== null && (
        <RoleModal papel={editPapel === "new" ? null : editPapel} papeis={papeis} permissoes={permissoes}
          onClose={() => setEditPapel(null)} onSave={loadPapeis} />
      )}
      {editUserRole && (
        <UserRoleModal user={editUserRole} papeis={papeis} onClose={() => setEditUserRole(null)} onSave={load} />
      )}

      {/* Confirm delete permissão */}
      {deletePermId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <Trash2 size={32} className="text-rose-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Excluir permissão?</h3>
            <p className="text-sm text-slate-500 mb-5">Ela será removida de todos os perfis que a usam.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePermId(null)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={() => deletePerm(deletePermId)} className="flex-1 btn-primary" style={{ background: "#ef4444" }}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete perfil */}
      {deletePapelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <Trash2 size={32} className="text-rose-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Excluir perfil?</h3>
            <p className="text-sm text-slate-500 mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePapelId(null)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={() => deletePapel(deletePapelId)} className="flex-1 btn-primary" style={{ background: "#ef4444" }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
