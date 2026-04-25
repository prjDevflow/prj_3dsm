import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLead, useNegotiations, useUpdateLead } from '../hooks/useLeads';
import Header from '../components/Header';
import {
  ArrowLeft, Send, MessageSquare, DollarSign, Phone,
  Calendar, User, Mail, Smartphone, Tag, Loader2,
  AlertCircle, Clock, CheckCircle, Lock, Pencil, X,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import { useQueryClient } from '@tanstack/react-query';
import { Lead, NegotiationImportance, NegotiationStage } from '../types';

const ORIGINS = ['Site','Google Ads','Facebook','LinkedIn','Instagram','WhatsApp','Indicação','Evento','Telefone','Visita Presencial','Outros'];
const STORES  = [{ value: 'loja1', label: 'Loja Centro' }, { value: 'loja2', label: 'Loja Norte' }, { value: 'loja3', label: 'Loja Sul' }];

const importanceBadge: Record<NegotiationImportance, string> = {
  frio:   'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  morno:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  quente: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};
const importanceLabel: Record<NegotiationImportance, string> = {
  frio: 'Frio', morno: 'Morno', quente: 'Quente',
};
const stageLabel: Record<NegotiationStage, string> = {
  primeiro_contato: 'Primeiro Contato',
  qualificacao:     'Qualificação',
  proposta_enviada: 'Proposta Enviada',
  negociacao:       'Negociação',
  fechamento:       'Fechamento',
};

const LeadDetail = () => {
  const { id }         = useParams<{ id: string }>();
  const navigate       = useNavigate();
  const queryClient    = useQueryClient();

  // Negociação
  const [content, setContent]   = useState('');
  const [negType, setNegType]   = useState<'comentário' | 'proposta' | 'contato'>('comentário');
  const [negImp, setNegImp]     = useState<NegotiationImportance>('frio');
  const [negStage, setNegStage] = useState<NegotiationStage>('primeiro_contato');
  const [sending, setSending]   = useState(false);
  const [negError, setNegError] = useState('');

  // Fechar negociação
  const [closingId, setClosingId]               = useState<string | null>(null);
  const [showCloseModal, setShowCloseModal]     = useState(false);
  const [closeReason, setCloseReason]           = useState('');
  const [selectedNegotiation, setSelectedNeg]   = useState<string | null>(null);

  // Editar lead
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm]           = useState<Partial<Lead>>({});
  const [editError, setEditError]         = useState('');
  const updateLead = useUpdateLead();

  const { data: lead, isLoading: leadLoading, error: leadError } = useLead(id!);
  const { data: negotiations, isLoading: negLoading }            = useNegotiations(id!);

  const activeNegotiation    = negotiations?.find(n => n.status === 'ativa');
  const hasActiveNegotiation = !!activeNegotiation;

  const statusColors: Record<string, string> = {
    novo: 'bg-blue-100 text-blue-700', contatado: 'bg-amber-100 text-amber-700',
    qualificado: 'bg-purple-100 text-purple-700', perdido: 'bg-rose-100 text-rose-700',
    ganho: 'bg-emerald-100 text-emerald-700',
  };
  const importanceColors: Record<string, string> = {
    baixa: 'bg-slate-100 text-slate-700', media: 'bg-indigo-100 text-indigo-700',
    alta: 'bg-orange-100 text-orange-700',
  };
  const typeIcons: Record<string, JSX.Element> = {
    comentário: <MessageSquare size={16} className="text-slate-500" />,
    proposta:   <DollarSign   size={16} className="text-emerald-600" />,
    contato:    <Phone        size={16} className="text-blue-600" />,
  };

  const handleAddNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { setNegError('Escreva uma mensagem antes de enviar.'); return; }
    if (sending) return;
    setSending(true); setNegError('');
    try {
      await api.post(`/leads/${id}/negotiations`, { content, type: negType, importance: negImp, stage: negStage });
      setContent(''); setNegType('comentário'); setNegImp('frio'); setNegStage('primeiro_contato');
      await queryClient.invalidateQueries({ queryKey: ['negotiations', id] });
    } catch (err: any) {
      setNegError(err.response?.data?.message || 'Erro ao adicionar negociação.');
    } finally {
      setSending(false);
    }
  };

  const handleCloseNegotiation = async () => {
    if (!selectedNegotiation || !closeReason.trim()) return;
    setClosingId(selectedNegotiation); setNegError('');
    try {
      await api.put(`/negotiations/${selectedNegotiation}/close`, { reason: closeReason });
      await queryClient.invalidateQueries({ queryKey: ['negotiations', id] });
      setShowCloseModal(false); setCloseReason(''); setSelectedNeg(null);
    } catch (err: any) {
      setNegError(err.response?.data?.message || 'Erro ao encerrar negociação.');
    } finally {
      setClosingId(null);
    }
  };

  const openEditLead = () => {
    if (!lead) return;
    setEditForm({
      name: lead.name, email: lead.email, phone: lead.phone,
      status: lead.status, importance: lead.importance,
      origin: lead.origin, store: lead.store,
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleSaveLead = async () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      setEditError('Nome e email são obrigatórios.'); return;
    }
    try {
      await updateLead.mutateAsync({ id: id!, ...editForm });
      setShowEditModal(false);
      await queryClient.invalidateQueries({ queryKey: ['lead', id] });
    } catch {
      setEditError('Erro ao salvar. Tente novamente.');
    }
  };

  if (leadLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
        </div>
      </div>
    );
  }

  if (leadError || !lead) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-rose-50 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600">Erro ao carregar lead</p>
            <button onClick={() => navigate('/leads')} className="mt-4 btn-primary">Voltar para lista</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Voltar ── */}
        <button onClick={() => navigate('/leads')} className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 group">
          <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Voltar para lista
        </button>

        {/* ── Card do Lead ── */}
        <div className="card overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{lead.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">ID: {lead.id}</p>
            </div>
            <button onClick={openEditLead} className="btn-secondary flex items-center gap-2 text-sm">
              <Pencil size={14} /> Editar
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Mail size={16} className="mr-3 text-slate-400" />{lead.email}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Smartphone size={16} className="mr-3 text-slate-400" />{lead.phone}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar size={16} className="mr-3 text-slate-400" />
                  Criado em: {format(new Date(lead.createdAt), 'dd/MM/yyyy')}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Tag size={16} className="mr-3 text-slate-400" />Origem: {lead.origin}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
              <span className={`badge ${statusColors[lead.status]}`}>{lead.status}</span>
              <span className={`badge ${importanceColors[lead.importance]}`}>{lead.importance}</span>
              {lead.store && <span className="badge bg-slate-100 text-slate-700">{STORES.find(s => s.value === lead.store)?.label ?? lead.store}</span>}
              {lead.assignedTo && <span className="badge bg-slate-100 text-slate-700"><User size={11} className="inline mr-1" />Resp: {lead.assignedTo}</span>}
              {hasActiveNegotiation && (
                <span className="badge bg-emerald-100 text-emerald-700 flex items-center">
                  <CheckCircle size={12} className="mr-1" /> Negociação ativa
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Negociações ── */}
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800">Histórico de Negociações</h3>
          </div>

          {/* Form nova negociação */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            {hasActiveNegotiation ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Lock size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Negociação ativa em andamento</p>
                  <p className="text-xs text-blue-600 mt-1">Encerre a negociação atual antes de iniciar uma nova.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddNegotiation} className="space-y-4">
                {negError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={14} />{negError}
                  </div>
                )}
                <textarea
                  rows={3} value={content}
                  onChange={e => { setContent(e.target.value); setNegError(''); }}
                  placeholder="Descreva a interação com o lead..."
                  className="input w-full" disabled={sending}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tipo</label>
                    <select value={negType} onChange={e => setNegType(e.target.value as any)} className="input w-full text-sm" disabled={sending}>
                      <option value="comentário">Comentário</option>
                      <option value="proposta">Proposta</option>
                      <option value="contato">Contato</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Importância</label>
                    <select value={negImp} onChange={e => setNegImp(e.target.value as NegotiationImportance)} className="input w-full text-sm" disabled={sending}>
                      <option value="frio">Frio</option>
                      <option value="morno">Morno</option>
                      <option value="quente">Quente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Estágio</label>
                    <select value={negStage} onChange={e => setNegStage(e.target.value as NegotiationStage)} className="input w-full text-sm" disabled={sending}>
                      <option value="primeiro_contato">Primeiro Contato</option>
                      <option value="qualificacao">Qualificação</option>
                      <option value="proposta_enviada">Proposta Enviada</option>
                      <option value="negociacao">Negociação</option>
                      <option value="fechamento">Fechamento</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={sending || !content.trim()} className="btn-primary flex items-center gap-2">
                    {sending ? <><Loader2 size={16} className="animate-spin" />Enviando...</> : <><Send size={16} />Adicionar</>}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Lista */}
          <div className="p-6">
            {negLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : negotiations && negotiations.length > 0 ? (
              <div className="space-y-4">
                {negotiations.map(item => (
                  <div key={item.id} className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                    item.status === 'ativa' ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 hover:bg-slate-100'
                  }`}>
                    <div className="flex-shrink-0 mt-1">{typeIcons[item.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-slate-500 uppercase">{item.type}</span>
                          <span className={`badge text-xs ${importanceBadge[item.importance as NegotiationImportance] ?? 'bg-slate-100 text-slate-600'}`}>
                            {importanceLabel[item.importance as NegotiationImportance] ?? item.importance}
                          </span>
                          <span className="badge bg-slate-100 text-slate-600 text-xs">
                            {stageLabel[item.stage as NegotiationStage] ?? item.stage}
                          </span>
                          <span className={`badge text-xs ${item.status === 'ativa' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {item.status === 'ativa' ? 'Ativa' : 'Encerrada'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={11} />{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                          </span>
                          {item.status === 'ativa' && (
                            <button onClick={() => { setSelectedNeg(item.id); setShowCloseModal(true); }}
                              className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                              Encerrar
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-700">{item.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <User size={11} />Atendente {item.userId}
                        </span>
                        {item.closedAt && (
                          <span className="text-xs text-slate-400">
                            Encerrado em: {format(new Date(item.closedAt), 'dd/MM/yyyy')}
                            {item.closedReason && ` · ${item.closedReason}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600">Nenhuma negociação registrada</p>
                <p className="text-xs text-slate-400 mt-1">Adicione a primeira interação usando o formulário acima</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal encerrar negociação ── */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Encerrar negociação</h3>
            <p className="text-sm text-slate-600 mb-4">Informe o motivo do encerramento.</p>
            <textarea rows={3} value={closeReason} onChange={e => setCloseReason(e.target.value)}
              placeholder="Ex: Cliente desistiu, negócio fechado..." className="input w-full mb-4" />
            <div className="flex gap-3">
              <button onClick={handleCloseNegotiation} disabled={!closeReason.trim() || closingId !== null}
                className="flex-1 btn-primary flex items-center justify-center gap-2">
                {closingId ? <><Loader2 size={16} className="animate-spin" />Encerrando...</> : 'Confirmar'}
              </button>
              <button onClick={() => { setShowCloseModal(false); setCloseReason(''); setSelectedNeg(null); }}
                className="flex-1 btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal editar lead ── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">Editar Lead</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {editError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={14} />{editError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nome *</label>
                  <input type="text" value={editForm.name ?? ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email *</label>
                  <input type="email" value={editForm.email ?? ''} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} className="input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Telefone</label>
                  <input type="text" value={editForm.phone ?? ''} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} className="input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                  <select value={editForm.status ?? 'novo'} onChange={e => setEditForm(p => ({ ...p, status: e.target.value as Lead['status'] }))} className="input w-full">
                    <option value="novo">Novo</option><option value="contatado">Contatado</option>
                    <option value="qualificado">Qualificado</option><option value="perdido">Perdido</option><option value="ganho">Ganho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Importância</label>
                  <select value={editForm.importance ?? 'media'} onChange={e => setEditForm(p => ({ ...p, importance: e.target.value as Lead['importance'] }))} className="input w-full">
                    <option value="baixa">Baixa</option><option value="media">Média</option><option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Origem</label>
                  <select value={editForm.origin ?? 'Site'} onChange={e => setEditForm(p => ({ ...p, origin: e.target.value }))} className="input w-full">
                    {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Loja</label>
                  <select value={editForm.store ?? 'loja1'} onChange={e => setEditForm(p => ({ ...p, store: e.target.value }))} className="input w-full">
                    {STORES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSaveLead} disabled={updateLead.isPending} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {updateLead.isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
