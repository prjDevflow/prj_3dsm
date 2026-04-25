import { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from '../hooks/useTeams';
import { useUsers } from '../hooks/useUsers';
import { Team } from '../types';
import {
  Plus, Edit2, Trash2, Users, Building2, X, Loader2,
  CheckCircle, AlertCircle, Search, UserPlus, ChevronDown, ChevronUp,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const avatarColors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-indigo-500','bg-teal-500','bg-orange-500'];
const avatarColor  = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const Teams = () => {
  const { user } = useAuth();
  const role      = user?.role;
  const isAdmin   = role === 'admin';
  const isGerente = role === 'gerente';

  const { data: teams = [], isLoading } = useTeams();
  const { data: usersData }             = useUsers({ limit: 100 });
  const allUsers   = usersData?.data ?? [];
  const gerentes   = allUsers.filter(u => u.role === 'gerente');
  const atendentes = allUsers.filter(u => u.role === 'atendente');

  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  const [search, setSearch]               = useState('');
  const [showModal, setShowModal]         = useState(false);
  const [editingTeam, setEditingTeam]     = useState<Team | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedTeam, setExpandedTeam]   = useState<string | null>(null);
  const [success, setSuccess]             = useState('');
  const [formError, setFormError]         = useState('');

  const [formData, setFormData] = useState({
    name: '', description: '', managerId: '', members: [] as string[],
  });

  const visibleTeams = isGerente
    ? teams.filter(t => t.managerId === user?.id)
    : teams.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.description ?? '').toLowerCase().includes(search.toLowerCase())
      );

  const openCreate = () => {
    setFormData({ name: '', description: '', managerId: '', members: [] });
    setEditingTeam(null);
    setShowModal(true);
  };

  const openEdit = (team: Team) => {
    setFormData({
      name: team.name,
      description: team.description ?? '',
      managerId: team.managerId ?? '',
      members: [...(team.members ?? [])],
    });
    setEditingTeam(team);
    setShowModal(true);
  };

  const toggleMember = (id: string) =>
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter(m => m !== id)
        : [...prev.members, id],
    }));

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    try {
      if (editingTeam) {
        await updateTeam.mutateAsync({ id: editingTeam.id, ...formData });
        showFeedback('Equipe atualizada com sucesso!');
      } else {
        await createTeam.mutateAsync(formData);
        showFeedback('Equipe criada com sucesso!');
      }
      setShowModal(false);
    } catch {
      setFormError('Erro ao salvar equipe. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeam.mutateAsync(id);
      showFeedback('Equipe removida com sucesso!');
      setDeleteConfirm(null);
    } catch {
      setFormError('Erro ao remover equipe.');
    }
  };

  const showFeedback = (msg: string) => {
    setSuccess(msg);
    setFormError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const isSaving = createTeam.isPending || updateTeam.isPending;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Cabeçalho ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">Equipes</h1>
            <p className="text-sm text-slate-500 mt-1">
              {isAdmin   ? 'Gerencie as equipes e seus membros'
              : isGerente ? 'Sua equipe e seus membros'
              :             'Visão consolidada de todas as equipes'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                <Building2 size={16} className="text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-slate-800">{visibleTeams.length}</span>
                <span className="text-sm text-slate-500">equipes</span>
              </div>
            )}
            {isAdmin && (
              <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Nova Equipe
              </button>
            )}
          </div>
        </div>

        {/* ── Feedback ── */}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle size={16} /> {success}
          </div>
        )}
        {formError && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center gap-2 text-rose-700 text-sm">
            <AlertCircle size={16} /> {formError}
          </div>
        )}

        {/* ── Busca ── */}
        {!isGerente && (
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text" placeholder="Buscar equipe..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input w-full pl-9"
            />
          </div>
        )}

        {/* ── Lista ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : visibleTeams.length === 0 ? (
          <div className="card p-12 text-center text-slate-400">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Nenhuma equipe encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleTeams.map(team => {
              const expanded    = expandedTeam === team.id;
              const memberUsers = allUsers.filter(u => (team.members ?? []).includes(u.id));
              const manager     = allUsers.find(u => u.id === team.managerId);

              return (
                <div key={team.id} className="card overflow-hidden">
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar + info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${avatarColor(team.name)}`}>
                        <Building2 size={20} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{team.name}</p>
                        {team.description && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">{team.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-5 text-sm text-slate-500 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} />
                        <span>{(team.members ?? []).length} membros</span>
                      </div>
                      {manager && (
                        <div className="hidden sm:flex items-center gap-1.5">
                          <UserPlus size={14} />
                          <span>{manager.name}</span>
                        </div>
                      )}
                      <span className="hidden md:block text-xs text-slate-400">
                        {format(new Date(team.createdAt), 'dd MMM yyyy', { locale: ptBR })}
                      </span>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setExpandedTeam(expanded ? null : team.id)}
                        className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                      >
                        Membros {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                      {isAdmin && (
                        <>
                          <button onClick={() => openEdit(team)} className="btn-secondary px-2.5 py-1.5">
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(deleteConfirm === team.id ? null : team.id)}
                            className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Membros */}
                  {expanded && (
                    <div className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                      {memberUsers.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Nenhum membro nesta equipe.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {memberUsers.map(u => (
                            <div key={u.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${avatarColor(u.name)}`}>
                                <span className="text-white text-[10px] font-bold">{u.name.charAt(0)}</span>
                              </div>
                              <span className="text-xs font-medium text-slate-700">{u.name}</span>
                              <span className="text-[10px] text-slate-400 capitalize">{u.role}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Confirmação delete */}
                  {deleteConfirm === team.id && (
                    <div className="border-t border-rose-100 bg-rose-50 px-5 py-3 flex items-center justify-between gap-4">
                      <p className="text-sm text-rose-700">
                        Remover <strong>{team.name}</strong>? Esta ação não pode ser desfeita.
                      </p>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => setDeleteConfirm(null)} className="btn-secondary text-xs px-3 py-1.5">Cancelar</button>
                        <button
                          onClick={() => handleDelete(team.id)}
                          disabled={deleteTeam.isPending}
                          className="text-xs px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1.5"
                        >
                          {deleteTeam.isPending ? <Loader2 size={13} className="animate-spin" /> : 'Confirmar'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingTeam ? 'Editar Equipe' : 'Nova Equipe'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome *</label>
                <input
                  type="text" value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="input w-full" placeholder="Ex: Vendas Centro"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Descrição</label>
                <input
                  type="text" value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="input w-full" placeholder="Descrição da equipe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Gerente Responsável</label>
                <select
                  value={formData.managerId}
                  onChange={e => setFormData(p => ({ ...p, managerId: e.target.value }))}
                  className="input w-full"
                >
                  <option value="">Selecionar gerente...</option>
                  {gerentes.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Membros ({formData.members.length} selecionados)
                </label>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-44 overflow-y-auto">
                  {atendentes.length === 0 ? (
                    <p className="text-sm text-slate-400 p-4 italic">Nenhum atendente disponível.</p>
                  ) : atendentes.map(a => (
                    <label key={a.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.members.includes(a.id)}
                        onChange={() => toggleMember(a.id)}
                        className="w-4 h-4 accent-[var(--color-primary)]"
                      />
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${avatarColor(a.name)}`}>
                        <span className="text-white text-[10px] font-bold">{a.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-slate-700">{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.name.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving
                  ? <Loader2 size={15} className="animate-spin" />
                  : <CheckCircle size={15} />}
                {editingTeam ? 'Salvar' : 'Criar Equipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
