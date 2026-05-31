import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../components/Header";
import api from "../../services/instanceApi";
import { useToast } from "../../components/Toast";
import { UsersService } from "../../services/implementations/UsersService";
import { IUser } from "../../services/IUsersService";
import {
  ShieldCheck, Plus, Pencil, Trash2, Users, Loader2,
  Check, X, Search, ChevronDown, ChevronUp, Save,
  LayoutDashboard, FileText, Settings, UserCheck, Building2, BarChart2, Lock, Zap,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
interface Papel {
  id: string; nome: string; descricao: string; cor: string;
  editavel: boolean; userCount: number;
  capabilities: { pages: Record<string, boolean>; actions: Record<string, boolean> };
}

// ── Config de páginas e ações ────────────────────────────────────
const PAGE_CONFIG = [
  { key: "dashboard", label: "Dashboard",         icon: BarChart2 },
  { key: "leads",     label: "Leads",             icon: Users },
  { key: "clients",   label: "Clientes",          icon: UserCheck },
  { key: "teams",     label: "Equipes",           icon: Building2 },
  { key: "settings",  label: "Configurações",     icon: Settings },
  { key: "logs",      label: "Logs de Auditoria", icon: FileText },
  { key: "admin",     label: "Painel Admin",      icon: ShieldCheck },
  { key: "users",     label: "Usuários",          icon: Users },
];
const ACTION_CONFIG = [
  { key: "create_lead",      label: "Criar leads" },
  { key: "delete_lead",      label: "Excluir leads" },
  { key: "view_all_leads",   label: "Ver leads de todos" },
  { key: "export_csv",       label: "Exportar CSV/Excel" },
  { key: "import_csv",       label: "Importar leads via CSV" },
  { key: "create_user",      label: "Criar usuários" },
  { key: "delete_user",      label: "Excluir usuários" },
];

const COLORS = ["#7C3AED","#4F46E5","#2563EB","#0891B2","#059669","#D97706","#DC2626","#DB2777","#64748B","#17364F"];

const usersService = new UsersService();

// ── ROLE CARD ────────────────────────────────────────────────────
function RoleCard({ papel, onEdit, onDelete }: { papel: Papel; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1.5 w-full" style={{ background: papel.cor }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: papel.cor }}>
              {papel.nome.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{papel.nome}</p>
              {!papel.editavel && (
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Sistema</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-[var(--color-primary)] hover:bg-slate-100 rounded-lg transition-colors" title="Editar">
              <Pencil size={14} />
            </button>
            {papel.editavel && (
              <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Excluir">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed min-h-[32px]">{papel.descricao || "Sem descrição."}</p>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1"><Users size={11} /> {papel.userCount} usuário{papel.userCount !== 1 ? "s" : ""}</span>
          <span className="flex items-center gap-1">
            <Lock size={11} /> {Object.values(papel.capabilities.pages).filter(Boolean).length} páginas
          </span>
          <span className="flex items-center gap-1">
            <Zap size={11} /> {Object.values(papel.capabilities.actions).filter(Boolean).length} ações
          </span>
        </div>
      </div>
    </div>
  );
}

// ── ROLE MODAL ────────────────────────────────────────────────────
function RoleModal({ papel, papeis, onClose, onSave }: {
  papel: Papel | null; papeis: Papel[]; onClose: () => void; onSave: () => void;
}) {
  const toast = useToast();
  const isNew = !papel;
  const [nome, setNome]       = useState(papel?.nome ?? "");
  const [descricao, setDesc]  = useState(papel?.descricao ?? "");
  const [cor, setCor]         = useState(papel?.cor ?? "#17364F");
  const [baseId, setBaseId]   = useState("");
  const [caps, setCaps]       = useState(papel?.capabilities ?? {
    pages: Object.fromEntries(PAGE_CONFIG.map((p) => [p.key, false])),
    actions: Object.fromEntries(ACTION_CONFIG.map((a) => [a.key, false])),
  });
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (isNew && baseId) {
      const base = papeis.find((p) => p.id === baseId);
      if (base) setCaps(JSON.parse(JSON.stringify(base.capabilities)));
    }
  }, [baseId]);

  const togglePage   = (k: string) => setCaps((c) => ({ ...c, pages:   { ...c.pages,   [k]: !c.pages[k] } }));
  const toggleAction = (k: string) => setCaps((c) => ({ ...c, actions: { ...c.actions, [k]: !c.actions[k] } }));

  const handleSave = async () => {
    if (!nome.trim() && isNew) { toast.error("Nome é obrigatório."); return; }
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/papeis", { nome, descricao, cor, capabilities: caps, basePapelId: baseId || undefined });
        toast.success("Perfil criado com sucesso!");
      } else {
        await api.put(`/papeis/${papel!.id}`, { nome: papel!.editavel ? nome : undefined, descricao, cor, capabilities: caps });
        toast.success("Perfil atualizado!");
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao salvar.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{isNew ? "Criar novo perfil" : `Editar — ${papel!.nome}`}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Nome + cor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome do perfil</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={!isNew && !papel?.editavel}
                className="input w-full disabled:opacity-60"
                placeholder="Ex: Supervisor"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Cor</label>
              <div className="flex gap-1.5 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => setCor(c)}
                    className={`w-7 h-7 rounded-lg transition-all ${cor === c ? "ring-2 ring-offset-1 ring-slate-400 scale-110" : ""}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Descrição</label>
            <input value={descricao} onChange={(e) => setDesc(e.target.value)} className="input w-full" placeholder="Descreva as responsabilidades deste perfil" />
          </div>

          {/* Base (apenas para criação) */}
          {isNew && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Herdar permissões de</label>
              <select value={baseId} onChange={(e) => setBaseId(e.target.value)} className="input w-full">
                <option value="">Começar do zero</option>
                {papeis.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          )}

          {/* Páginas */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Páginas acessíveis</p>
            <div className="grid grid-cols-2 gap-2">
              {PAGE_CONFIG.map(({ key, label, icon: Icon }) => (
                <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${caps.pages[key] ? "border-[var(--color-primary)] bg-[var(--color-primary-10)]" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="checkbox" checked={!!caps.pages[key]} onChange={() => togglePage(key)} className="sr-only" />
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${caps.pages[key] ? "bg-[var(--color-primary)]" : "bg-slate-200"}`}>
                    {caps.pages[key] && <Check size={10} className="text-white" />}
                  </div>
                  <Icon size={14} className={caps.pages[key] ? "text-[var(--color-primary)]" : "text-slate-400"} />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Ações permitidas</p>
            <div className="grid grid-cols-2 gap-2">
              {ACTION_CONFIG.map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${caps.actions[key] ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="checkbox" checked={!!caps.actions[key]} onChange={() => toggleAction(key)} className="sr-only" />
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${caps.actions[key] ? "bg-emerald-500" : "bg-slate-200"}`}>
                    {caps.actions[key] && <Check size={10} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isNew ? "Criar perfil" : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── USER EXTRAS MODAL ─────────────────────────────────────────────
function UserExtrasModal({ user, papeis, onClose, onSave }: {
  user: IUser; papeis: Papel[]; onClose: () => void; onSave: () => void;
}) {
  const toast = useToast();
  const [extras, setExtras] = useState<{ pages: Record<string, boolean>; actions: Record<string, boolean> }>({ pages: {}, actions: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const papel = papeis.find((p) => p.nome.toLowerCase() === user.role.toUpperCase() || p.nome === user.role.toUpperCase());

  useEffect(() => {
    api.get(`/papeis/user/${user.id}`).then(({ data }) => {
      setExtras(data.extras ?? { pages: {}, actions: {} });
    }).finally(() => setLoading(false));
  }, [user.id]);

  const toggleExtra = (type: "pages" | "actions", key: string) => {
    setExtras((e) => ({
      ...e,
      [type]: { ...e[type], [key]: e[type][key] === true ? false : e[type][key] === false ? undefined : true },
    }));
  };

  const getState = (type: "pages" | "actions", key: string): "inherited" | "granted" | "revoked" => {
    const extra = extras[type]?.[key];
    if (extra === true)  return "granted";
    if (extra === false) return "revoked";
    return "inherited";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/papeis/user/${user.id}/extras`, extras);
      toast.success("Permissões atualizadas!");
      onSave();
      onClose();
    } catch { toast.error("Erro ao salvar permissões."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-800">Permissões de {user.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Overrides individuais sobre o perfil base</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[var(--color-primary)]" /></div>
        ) : (
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-slate-200" /> Herdado do perfil</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" /> Concedido extra</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-rose-500" /> Revogado</span>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Páginas</p>
              <div className="grid grid-cols-2 gap-2">
                {PAGE_CONFIG.map(({ key, label, icon: Icon }) => {
                  const state = getState("pages", key);
                  return (
                    <button key={key} onClick={() => toggleExtra("pages", key)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all text-sm ${
                        state === "granted" ? "border-emerald-500 bg-emerald-50" :
                        state === "revoked" ? "border-rose-400 bg-rose-50" :
                        "border-slate-200 hover:border-slate-300"
                      }`}>
                      <Icon size={14} className={state === "granted" ? "text-emerald-600" : state === "revoked" ? "text-rose-500" : "text-slate-400"} />
                      <span className="font-medium">{label}</span>
                      {state === "granted" && <Check size={12} className="ml-auto text-emerald-600" />}
                      {state === "revoked" && <X size={12} className="ml-auto text-rose-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Ações</p>
              <div className="grid grid-cols-2 gap-2">
                {ACTION_CONFIG.map(({ key, label }) => {
                  const state = getState("actions", key);
                  return (
                    <button key={key} onClick={() => toggleExtra("actions", key)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all text-sm ${
                        state === "granted" ? "border-emerald-500 bg-emerald-50" :
                        state === "revoked" ? "border-rose-400 bg-rose-50" :
                        "border-slate-200 hover:border-slate-300"
                      }`}>
                      <span className="font-medium flex-1">{label}</span>
                      {state === "granted" && <Check size={12} className="text-emerald-600" />}
                      {state === "revoked" && <X size={12} className="text-rose-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Salvar permissões
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [tab, setTab]             = useState<"roles" | "users">("roles");
  const [papeis, setPapeis]       = useState<Papel[]>([]);
  const [users, setUsers]         = useState<IUser[]>([]);
  const [search, setSearch]       = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editPapel, setEditPapel] = useState<Papel | null | "new">(null);
  const [editUser, setEditUser]   = useState<IUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedUser, setExpandedUser]   = useState<string | null>(null);

  const loadPapeis = async () => {
    const { data } = await api.get<Papel[]>("/papeis");
    setPapeis(data);
  };

  const loadUsers = async (q = search) => {
    const res = await usersService.getUsers({ limit: 100, search: q || undefined });
    setUsers(res.data);
  };

  const load = async () => {
    setIsLoading(true);
    try { await Promise.all([loadPapeis(), loadUsers()]); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/papeis/${id}`);
      toast.success("Perfil excluído.");
      setDeleteConfirm(null);
      await loadPapeis();
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Erro ao excluir.");
      setDeleteConfirm(null);
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Lock size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Acesso restrito a administradores.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Painel Administrativo</h1>
              <p className="text-sm text-slate-500 mt-0.5">{papeis.length} perfis · {users.length} usuários</p>
            </div>
          </div>
          {tab === "roles" && (
            <button onClick={() => setEditPapel("new")} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Criar perfil
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
          {[
            { key: "roles", label: "Perfis & Permissões", icon: ShieldCheck },
            { key: "users", label: "Permissões por Usuário", icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" /></div>
        ) : tab === "roles" ? (
          /* ── Tab Perfis ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {papeis.map((p) => (
              <RoleCard
                key={p.id}
                papel={p}
                onEdit={() => setEditPapel(p)}
                onDelete={() => setDeleteConfirm(p.id)}
              />
            ))}
          </div>
        ) : (
          /* ── Tab Usuários ── */
          <div>
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); loadUsers(e.target.value); }}
                className="input pl-9 w-full max-w-xs text-sm"
              />
            </div>

            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Usuário</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Perfil</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Permissões extras</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const papel = papeis.find((p) => p.nome === u.role.toUpperCase());
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
                            {papel?.nome ?? u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {u.active !== false ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-600"><Check size={11} /> Ativo</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-slate-400"><X size={11} /> Inativo</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => setEditUser(u)}
                              className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                            >
                              Configurar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal criar/editar papel */}
      {(editPapel !== null) && (
        <RoleModal
          papel={editPapel === "new" ? null : editPapel}
          papeis={papeis}
          onClose={() => setEditPapel(null)}
          onSave={loadPapeis}
        />
      )}

      {/* Modal permissões do usuário */}
      {editUser && (
        <UserExtrasModal
          user={editUser}
          papeis={papeis}
          onClose={() => setEditUser(null)}
          onSave={load}
        />
      )}

      {/* Confirmar exclusão */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <Trash2 size={32} className="text-rose-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Excluir perfil?</h3>
            <p className="text-sm text-slate-500 mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 btn-primary bg-rose-500 hover:bg-rose-600">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
