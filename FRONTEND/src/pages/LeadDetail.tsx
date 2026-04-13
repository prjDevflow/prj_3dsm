import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLead, useNegotiations } from '../hooks/useLeads';
import Header from '../components/Header';
import { 
  ArrowLeft, 
  Send, 
  MessageSquare, 
  DollarSign, 
  Phone,
  Calendar,
  User,
  Mail,
  Smartphone,
  Tag,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Lock
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [newNegotiation, setNewNegotiation] = useState('');
  const [type, setType] = useState<'comentário' | 'proposta' | 'contato'>('comentário');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [closingId, setClosingId] = useState<string | null>(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  const [selectedNegotiation, setSelectedNegotiation] = useState<string | null>(null);

  const { data: lead, isLoading: leadLoading, error: leadError } = useLead(id!);
  const { data: negotiations, isLoading: negotiationsLoading, refetch } = useNegotiations(id!);

  // Verificar se existe negociação ativa
  const activeNegotiation = negotiations?.find(n => n.status === 'ativa');
  const hasActiveNegotiation = !!activeNegotiation;

  const handleAddNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNegotiation.trim()) {
      setError('Por favor, escreva uma mensagem');
      return;
    }
    
    if (sending) return;

    setSending(true);
    setError('');

    try {
      await api.post(`/leads/${id}/negotiations`, {
        content: newNegotiation,
        type: type,
      });

      setNewNegotiation('');
      setType('comentário');
      await queryClient.invalidateQueries({ queryKey: ['negotiations', id] });
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao adicionar negociação');
    } finally {
      setSending(false);
    }
  };

  const handleCloseNegotiation = async () => {
    if (!selectedNegotiation || !closeReason.trim()) return;

    setClosingId(selectedNegotiation);
    setError('');

    try {
      await api.put(`/negotiations/${selectedNegotiation}/close`, {
        reason: closeReason
      });

      await queryClient.invalidateQueries({ queryKey: ['negotiations', id] });
      setShowCloseModal(false);
      setCloseReason('');
      setSelectedNegotiation(null);
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erro ao encerrar negociação');
    } finally {
      setClosingId(null);
    }
  };

  const statusColors = {
    novo: 'bg-blue-100 text-blue-700',
    contatado: 'bg-amber-100 text-amber-700',
    qualificado: 'bg-purple-100 text-purple-700',
    perdido: 'bg-rose-100 text-rose-700',
    ganho: 'bg-emerald-100 text-emerald-700',
  };

  const importanceColors = {
    baixa: 'bg-slate-100 text-slate-700',
    media: 'bg-indigo-100 text-indigo-700',
    alta: 'bg-orange-100 text-orange-700',
  };

  const typeIcons = {
    comentário: <MessageSquare size={16} className="text-slate-500" />,
    proposta: <DollarSign size={16} className="text-emerald-600" />,
    contato: <Phone size={16} className="text-blue-600" />,
  };

  if (leadLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0F3B5E] mx-auto mb-4" />
            <p className="text-slate-600">Carregando lead...</p>
          </div>
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
            <button
              onClick={() => navigate('/leads')}
              className="mt-4 btn-primary"
            >
              Voltar para lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 group"
        >
          <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Voltar para lista
        </button>

        {/* Lead Card */}
        <div className="card overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">{lead.name}</h2>
            <p className="text-xs text-slate-500 mt-1">ID: {lead.id}</p>
          </div>

          <div className="p-6">
            {/* Contact info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Mail size={16} className="mr-3 text-slate-400" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Smartphone size={16} className="mr-3 text-slate-400" />
                  <span>{lead.phone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar size={16} className="mr-3 text-slate-400" />
                  <span>Criado em: {format(new Date(lead.createdAt), 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Tag size={16} className="mr-3 text-slate-400" />
                  <span>Origem: {lead.origin}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
              <span className={`badge ${statusColors[lead.status]}`}>
                {lead.status}
              </span>
              <span className={`badge ${importanceColors[lead.importance]}`}>
                {lead.importance}
              </span>
              <span className="badge bg-slate-100 text-slate-700">
                Resp: {lead.assignedTo}
              </span>
              {hasActiveNegotiation && (
                <span className="badge bg-emerald-100 text-emerald-700 flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  Negociação ativa
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Negotiations Section */}
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800">Histórico de Negociações</h3>
          </div>

          {/* Add negotiation form - desabilitado se tiver negociação ativa */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            {hasActiveNegotiation ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Lock size={18} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">
                      Negociação ativa em andamento
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Este lead já possui uma negociação ativa. Encerre a negociação atual antes de iniciar uma nova.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddNegotiation} className="space-y-4">
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <textarea
                    rows={3}
                    value={newNegotiation}
                    onChange={(e) => {
                      setNewNegotiation(e.target.value);
                      setError('');
                    }}
                    placeholder="Descreva a interação com o lead..."
                    className="input w-full"
                    disabled={sending}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="input text-sm w-40"
                    disabled={sending}
                  >
                    <option value="comentário">Comentário</option>
                    <option value="proposta">Proposta</option>
                    <option value="contato">Contato</option>
                  </select>
                  
                  <button
                    type="submit"
                    disabled={sending || !newNegotiation.trim()}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Adicionar</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Negotiations list */}
          <div className="p-6">
            {negotiationsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#0F3B5E]" />
              </div>
            ) : negotiations && negotiations.length > 0 ? (
              <div className="space-y-4">
                {negotiations.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg transition-colors ${
                      item.status === 'ativa' 
                        ? 'bg-emerald-50 border border-emerald-200' 
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {typeIcons[item.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-slate-500 uppercase">
                            {item.type}
                          </span>
                          {item.status === 'ativa' ? (
                            <span className="badge bg-emerald-100 text-emerald-700 text-xs">
                              Ativa
                            </span>
                          ) : (
                            <span className="badge bg-slate-100 text-slate-600 text-xs">
                              Encerrada
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-xs text-slate-400">
                            <Clock size={12} className="mr-1" />
                            <span>{format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}</span>
                          </div>
                          {item.status === 'ativa' && (
                            <button
                              onClick={() => {
                                setSelectedNegotiation(item.id);
                                setShowCloseModal(true);
                              }}
                              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                            >
                              Encerrar
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-700">{item.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-slate-500">
                          <User size={12} className="mr-1" />
                          <span>Atendente {item.userId}</span>
                        </div>
                        {item.closedAt && (
                          <span className="text-xs text-slate-400">
                            Encerrado em: {format(new Date(item.closedAt), "dd/MM/yyyy")}
                            {item.closedReason && ` - ${item.closedReason}`}
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
                <p className="text-xs text-slate-400 mt-1">
                  Adicione a primeira interação usando o formulário acima
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal para encerrar negociação */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Encerrar negociação
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Por favor, informe o motivo do encerramento desta negociação.
            </p>

            <textarea
              rows={3}
              value={closeReason}
              onChange={(e) => setCloseReason(e.target.value)}
              placeholder="Ex: Cliente desistiu, negócio fechado, etc..."
              className="input w-full mb-4"
            />

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCloseNegotiation}
                disabled={!closeReason.trim() || closingId !== null}
                className="flex-1 btn-primary"
              >
                {closingId ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Encerrando...
                  </>
                ) : (
                  'Confirmar encerramento'
                )}
              </button>
              <button
                onClick={() => {
                  setShowCloseModal(false);
                  setCloseReason('');
                  setSelectedNegotiation(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;