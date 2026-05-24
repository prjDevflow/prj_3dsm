import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTeams } from "../../hooks/useTeams";
import { UsersService } from "../../services/implementations/UsersService";
import { IUser } from "../../services/IUsersService";
import { Header } from "../../components/Header";
import { Loader2, Search, ShieldCheck, Save, Check, X } from "lucide-react";

const usersService = new UsersService();

const ROLE_LABELS: Record<string, string> = {
  admin:         "Administrador",
  gerente_geral: "Gerente Geral",
  gerente:       "Gerente",
  atendente:     "Atendente",
};

const ROLE_COLORS: Record<string, string> = {
  admin:         "bg-purple-100 text-purple-700",
  gerente_geral: "bg-indigo-100 text-indigo-700",
  gerente:       "bg-blue-100 text-blue-700",
  atendente:     "bg-slate-100 text-slate-700",
};

type EditRow = { role: string; teamId: string; active: boolean };

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const { data: teams } = useTeams();

  const [users, setUsers]       = useState<IUser[]>([]);
  const [total, setTotal]       = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]     = useState("");
  const [editRows, setEditRows]   = useState<Record<string, EditRow>>({});
  const [saving, setSaving]       = useState<Record<string, boolean>>({});
  const [saved, setSaved]         = useState<Record<string, boolean>>({});
  const [saveError, setSaveError] = useState<Record<string, string>>({});

  const load = async (q = search) => {
    setIsLoading(true);
    try {
      const res = await usersService.getUsers({ limit: 100, search: q || undefined });
      setUsers(res.data);
      setTotal(res.total);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (u: IUser) => {
    setEditRows((prev) => ({
      ...prev,
      [u.id]: { role: u.role, teamId: u.teamId ?? "", active: u.active ?? true },
    }));
  };

  const cancelEdit = (id: string) => {
    setEditRows((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const handleSave = async (u: IUser) => {
    const row = editRows[u.id];
    if (!row) return;
    setSaving((p) => ({ ...p, [u.id]: true }));
    setSaveError((p) => { const n = { ...p }; delete n[u.id]; return n; });
    try {
      await usersService.updateUser(u.id, {
        role:   row.role,
        teamId: row.teamId || undefined,
        active: row.active,
      });
      setSaved((p) => ({ ...p, [u.id]: true }));
      setTimeout(() => setSaved((p) => { const n = { ...p }; delete n[u.id]; return n; }), 2000);
      cancelEdit(u.id);
      await load();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Erro ao salvar. Tente novamente.";
      setSaveError((p) => ({ ...p, [u.id]: msg }));
    } finally {
      setSaving((p) => ({ ...p, [u.id]: false }));
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Acesso restrito a administradores.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck size={28} className="text-[var(--color-primary)]" />
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Painel Administrativo</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Gerencie perfis e permissões dos usuários — {total} usuários no total
            </p>
          </div>
        </div>

        {/* Busca */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(search)}
            className="input pl-9 w-full max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Usuário</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Perfil atual</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Alterar perfil</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Equipe</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const editing = !!editRows[u.id];
                  const row     = editRows[u.id];
                  const isSelf  = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className={`transition-colors ${editing ? "bg-indigo-50/40" : "hover:bg-slate-50"}`}>
                      {/* Usuário */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Perfil atual */}
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${ROLE_COLORS[u.role] ?? "bg-slate-100 text-slate-600"}`}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>

                      {/* Alterar perfil (só quando editando) */}
                      <td className="px-5 py-3.5">
                        {editing ? (
                          <select
                            value={row.role}
                            onChange={(e) => setEditRows((p) => ({ ...p, [u.id]: { ...p[u.id], role: e.target.value } }))}
                            className="input text-sm py-1"
                            disabled={isSelf}
                          >
                            <option value="atendente">Atendente</option>
                            <option value="gerente">Gerente</option>
                            <option value="gerente_geral">Gerente Geral</option>
                            <option value="admin">Administrador</option>
                          </select>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>

                      {/* Equipe */}
                      <td className="px-5 py-3.5">
                        {editing ? (
                          <select
                            value={row.teamId}
                            onChange={(e) => setEditRows((p) => ({ ...p, [u.id]: { ...p[u.id], teamId: e.target.value } }))}
                            className="input text-sm py-1"
                          >
                            <option value="">Sem equipe</option>
                            {teams?.map((t) => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-slate-600">
                            {teams?.find((t) => t.id === u.teamId)?.name ?? "—"}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {editing ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.active}
                              onChange={(e) => setEditRows((p) => ({ ...p, [u.id]: { ...p[u.id], active: e.target.checked } }))}
                              className="sr-only peer"
                              disabled={isSelf}
                            />
                            <div className="relative w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                            <span className="text-xs text-slate-600">{row.active ? "Ativo" : "Inativo"}</span>
                          </label>
                        ) : (
                          u.active !== false ? (
                            <span className="inline-flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <Check size={11} className="mr-1" /> Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              <X size={11} className="mr-1" /> Inativo
                            </span>
                          )
                        )}
                      </td>

                      {/* Ações */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {saved[u.id] ? (
                          <span className="text-xs text-emerald-600 flex items-center justify-end gap-1">
                            <Check size={13} /> Salvo
                          </span>
                        ) : editing ? (
                          <div className="flex flex-col items-end gap-1.5">
                            {saveError[u.id] && (
                              <span className="text-xs text-rose-600">{saveError[u.id]}</span>
                            )}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSave(u)}
                                disabled={saving[u.id]}
                                className="flex items-center gap-1 text-xs bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
                              >
                                {saving[u.id] ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                Salvar
                              </button>
                              <button
                                onClick={() => cancelEdit(u.id)}
                                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1.5"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(u)}
                            className="text-xs text-[var(--color-primary)] hover:underline font-medium"
                          >
                            Editar perfil
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
