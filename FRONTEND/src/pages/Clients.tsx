import { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients';
import { useLeads } from '../hooks/useLeads';
import { Client } from '../types';
import {
  Plus, Edit2, Trash2, Search, X, Loader2,
  CheckCircle, AlertCircle, UserCheck, ChevronLeft, ChevronRight, ArrowUpRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const avatarColors = ['bg-blue-500','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-indigo-500','bg-teal-500','bg-orange-500'];
const avatarColor  = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

const emptyForm = (): Partial<Client> => ({
  name: '', email: '', phone: '', cpf: '', leadId: '',
});

const Clients = () => {
  const { user }  = useAuth();
  const isAdmin   = user?.role === 'admin';
  const limit     = 10;

  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal]         = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData]           = useState<Partial<Client>>(emptyForm());
  const [formError, setFormError]         = useState('');
  const [success, setSuccess]             = useState('');

  const assignedTo = isAdmin ? undefined : user?.id;

  const { data, isLoading }  = useClients({ page, limit, search, assignedTo });
  const { data: leadsData }  = useLeads({ limit: 100 });
  const leads                = leadsData?.data ?? [];

  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const clients    = data?.data    ?? [];
  const total      = data?.total   ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const startItem  = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem    = Math.min(page * limit, total);

  const openCreate = () => {
    setFormData({ ...emptyForm(), assignedTo: user?.id ?? '' });
    setEditingClient(null); setFormError('');
    setShowModal(true);
  };

  const openEdit = (client: Client) => {
    setFormData({ name: client.name, email: client.email, phone: client.phone, cpf: client.cpf, leadId: client.leadId });
    setEditingClient(client); setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) { setFormError('Nome é obrigatório.'); return; }
    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id, ...formData });
        showFeedback('Cliente atualizado com sucesso!');
      } else {
        await createClient.mutateAsync({ ...formData, assignedTo: user?.id });
        showFeedback('Cliente criado com sucesso!');
      }
      setShowModal(false);
    } catch {
      setFormError('Erro ao salvar cliente. Tente novamente.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient.mutateAsync(id);
      showFeedback('Cliente removido.');
      setDeleteConfirm(null);
    } catch {
      setFormError('Erro ao remover cliente.');
    }
  };

  const showFeedback = (msg: string) => {
    setSuccess(msg); setTimeout(() => setSuccess(''), 3000);
  };

  const isSaving = createClient.isPending || updateClient.isPending;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Cabeçalho ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">Clientes</h1>
            <p className="text-sm text-slate-500 mt-1">Clientes vinculados aos seus leads</p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                <UserCheck size={16} className="text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-slate-800">{total}</span>
                <span className="text-sm text-slate-500">clientes</span>
              </div>
            )}
            <button onClick={openCreate} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Novo Cliente
            </button>
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle size={16} />{success}
          </div>
        )}

        {/* ── Busca ── */}
        <div className="mb-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Buscar por nome, email ou CPF..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input w-full pl-9" />
        </div>

        {/* ── Tabela ── */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead Vinculado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Criado em</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)] mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Carregando clientes...</p>
                  </td></tr>
                ) : clients.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center">
                    <UserCheck size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm text-slate-500">Nenhum cliente encontrado</p>
                  </td></tr>
                ) : clients.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColor(client.name)}`}>
                          <span className="text-white text-xs font-semibold">{client.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-800">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{client.email}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{client.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {client.cpf || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      {client.leadId ? (
                        <a href={`/leads/${client.leadId}`} className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline font-medium">
                          {client.leadName || client.leadId} <ArrowUpRight size={11} />
                        </a>
                      ) : <span className="text-slate-300 text-sm">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {format(new Date(client.createdAt), 'dd MMM yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(client)} className="btn-secondary px-2.5 py-1.5">
                          <Edit2 size={14} />
                        </button>
                        {isAdmin && (
                          <button onClick={() => setDeleteConfirm(deleteConfirm === client.id ? null : client.id)}
                            className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirmação delete inline */}
          {deleteConfirm && (
            <div className="border-t border-rose-100 bg-rose-50 px-6 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-rose-700">Remover este cliente? Esta ação não pode ser desfeita.</p>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setDeleteConfirm(null)} className="btn-secondary text-xs px-3 py-1.5">Cancelar</button>
                <button onClick={() => handleDelete(deleteConfirm)} disabled={deleteClient.isPending}
                  className="text-xs px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-1.5">
                  {deleteClient.isPending ? <Loader2 size={13} className="animate-spin" /> : 'Confirmar'}
                </button>
              </div>
            </div>
          )}

          {/* Paginação */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <p className="text-sm text-slate-500">
              {total === 0 ? 'Nenhum resultado' : `Mostrando ${startItem}–${endItem} de ${total} clientes`}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === p ? 'bg-[var(--color-primary)] text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>{p}
                  </button>
                ))}
                <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal criar/editar ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={14} />{formError}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome *</label>
                <input type="text" value={formData.name ?? ''} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="input w-full" placeholder="Nome completo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={formData.email ?? ''} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="input w-full" placeholder="email@exemplo.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Telefone</label>
                  <input type="text" value={formData.phone ?? ''} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="input w-full" placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">CPF</label>
                <input type="text" value={formData.cpf ?? ''} onChange={e => setFormData(p => ({ ...p, cpf: e.target.value }))}
                  className="input w-full" placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Lead Vinculado</label>
                <select value={formData.leadId ?? ''} onChange={e => setFormData(p => ({ ...p, leadId: e.target.value }))} className="input w-full">
                  <option value="">Selecionar lead...</option>
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {isSaving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                {editingClient ? 'Salvar' : 'Criar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
