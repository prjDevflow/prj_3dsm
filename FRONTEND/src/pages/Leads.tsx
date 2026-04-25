import { useState } from 'react';
import Header from '../components/Header';
import LeadsTable from '../components/LeadsTable';
import { useLeads, useCreateLead, useUpdateLead } from '../hooks/useLeads';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { Lead } from '../types';
import { AlertCircle, Plus, X, CheckCircle, Loader2, Users } from 'lucide-react';
import { DateRange } from '../utils/dateUtils';

const ORIGINS = ['Site','Google Ads','Facebook','LinkedIn','Instagram','WhatsApp','Indicação','Evento','Telefone','Visita Presencial','Outros'];
const STORES  = [{ value: 'loja1', label: 'Loja Centro' }, { value: 'loja2', label: 'Loja Norte' }, { value: 'loja3', label: 'Loja Sul' }];

const emptyForm = () => ({
  name: '', email: '', phone: '',
  status: 'novo' as Lead['status'],
  importance: 'media' as Lead['importance'],
  origin: 'Site', store: 'loja1', assignedTo: '',
});

const Leads = () => {
  const { user } = useAuth();
  const isAdmin  = user?.role === 'admin';
  const isGerente = user?.role === 'gerente' || user?.role === 'gerente_geral';

  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [status, setStatus]         = useState<string | undefined>();
  const [importance, setImportance] = useState<string | undefined>();
  const [dateRange, setDateRange]   = useState<DateRange>(() => {
    const end = new Date(); const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const [store, setStore] = useState('all');
  const [team, setTeam]   = useState('all');
  const limit = 10;

  // Modal
  const [showModal, setShowModal]     = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData]       = useState(emptyForm());
  const [formError, setFormError]     = useState('');
  const [success, setSuccess]         = useState('');

  const { data, isLoading, error } = useLeads({ page, limit, search, status, importance, dateRange, store, team });
  const { data: usersData }        = useUsers({ limit: 100 });
  const atendentes                 = (usersData?.data ?? []).filter(u => u.role === 'atendente');

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const handleSearch = (term: string) => { setSearch(term); setPage(1); };
  const handleFilter = (filters: { status?: string; importance?: string }) => {
    setStatus(filters.status); setImportance(filters.importance); setPage(1);
  };
  const handleDateRangeChange = (range: DateRange) => { setDateRange(range); setPage(1); };
  const handleStoreChange     = (s: string) => { setStore(s); setPage(1); };
  const handleTeamChange      = (t: string) => { setTeam(t);  setPage(1); };

  const openCreate = () => {
    setFormData({ ...emptyForm(), assignedTo: (!isAdmin && !isGerente) ? user?.id ?? '' : '' });
    setEditingLead(null);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (lead: Lead) => {
    setFormData({
      name: lead.name, email: lead.email, phone: lead.phone,
      status: lead.status, importance: lead.importance,
      origin: lead.origin, store: lead.store ?? 'loja1',
      assignedTo: lead.assignedTo ?? '',
    });
    setEditingLead(lead);
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Nome e email são obrigatórios.');
      return;
    }
    try {
      if (editingLead) {
        await updateLead.mutateAsync({ id: editingLead.id, ...formData });
        showFeedback('Lead atualizado com sucesso!');
      } else {
        await createLead.mutateAsync({ ...formData, teamId: user?.teamId });
        showFeedback('Lead criado com sucesso!');
      }
      setShowModal(false);
    } catch {
      setFormError('Erro ao salvar lead. Tente novamente.');
    }
  };

  const showFeedback = (msg: string) => {
    setSuccess(msg); setFormError('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const isSaving = createLead.isPending || updateLead.isPending;
  const canCreate = isAdmin || isGerente || user?.role === 'atendente';

  const headerProps = {
    onDateRangeChange: handleDateRangeChange,
    onStoreChange: handleStoreChange,
    onTeamChange:  handleTeamChange,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header {...headerProps} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-rose-50 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600">Erro ao carregar leads</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header {...headerProps} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">Leads</h1>
            <p className="text-sm text-slate-500 mt-1">Gerencie e acompanhe todos os seus leads</p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && data && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                <Users size={16} className="text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-slate-800">{data.total}</span>
                <span className="text-sm text-slate-500">leads encontrados</span>
              </div>
            )}
            {canCreate && (
              <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Novo Lead
              </button>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-emerald-700 text-sm">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <LeadsTable
          leads={data?.data || []}
          total={data?.total || 0}
          page={data?.page || 1}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onEdit={canCreate ? openEdit : undefined}
          loading={isLoading}
        />
      </main>

      {/* ── Modal criar/editar lead ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="input w-full" placeholder="Nome da empresa ou contato" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="input w-full" placeholder="email@empresa.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Telefone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="input w-full" placeholder="(00) 00000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                  <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as Lead['status'] }))} className="input w-full">
                    <option value="novo">Novo</option>
                    <option value="contatado">Contatado</option>
                    <option value="qualificado">Qualificado</option>
                    <option value="perdido">Perdido</option>
                    <option value="ganho">Ganho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Importância</label>
                  <select value={formData.importance} onChange={e => setFormData(p => ({ ...p, importance: e.target.value as Lead['importance'] }))} className="input w-full">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Origem</label>
                  <select value={formData.origin} onChange={e => setFormData(p => ({ ...p, origin: e.target.value }))} className="input w-full">
                    {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Loja</label>
                  <select value={formData.store} onChange={e => setFormData(p => ({ ...p, store: e.target.value }))} className="input w-full">
                    {STORES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                {(isAdmin || isGerente) && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Atendente Responsável</label>
                    <select value={formData.assignedTo} onChange={e => setFormData(p => ({ ...p, assignedTo: e.target.value }))} className="input w-full">
                      <option value="">Selecionar atendente...</option>
                      {atendentes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {isSaving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                {editingLead ? 'Salvar' : 'Criar Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
