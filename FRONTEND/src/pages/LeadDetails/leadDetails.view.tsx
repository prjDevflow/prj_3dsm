import {
  ArrowLeft,
  Send,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Smartphone,
  Tag,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  Pencil,
  TrendingUp,
  X,
  History,
} from "lucide-react";
import { format } from "date-fns";
import { useLeadDetailsModel } from "./leadDetails.model";
import { Header } from "../../components/Header";
import { Lead, Negotiation, NegotiationImportance, NegotiationStage } from "../../types";

type LeadDetailsProps = ReturnType<typeof useLeadDetailsModel>;

export const LeadDetailsView = (props: LeadDetailsProps) => {
  const {
    leadLoading,
    leadError,
    lead,
    navigate,
    openEditLead,
    statusColors,
    importanceColors,
    hasActiveNegotiation,
    handleAddNegotiation,
    negError,
    content,
    setContent,
    setNegError,
    sending,
    setNegStage,
    negLoading,
    negotiations,
    importanceBadge,
    stageLabel,
    importanceLabel,
    setSelectedNeg,
    setShowCloseModal,
    showCloseModal,
    closeReason,
    setCloseReason,
    closePredefinedReason,
    setClosePredefinedReason,
    isCloseValid,
    handleCloseNegotiation,
    closingId,
    showEditModal,
    setShowEditModal,
    editError,
    editForm,
    setEditForm,
    ORIGINS,
    STORES,
    updateLead,
    handleSaveLead,
    setNegType,
    negType,
    negImp,
    setNegImp,
    negStage,
    timeToFirstContact,
    activeNegotiation,
    advanceStage,
    setAdvanceStage,
    advanceImp,
    setAdvanceImp,
    advancing,
    handleAdvanceStage,
    closeFinalStatus,
    setCloseFinalStatus,
    atendentes,
    history,
    historyLoading,
  } = props;

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
            <button
              onClick={() => navigate("/leads")}
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
        {/* ── Voltar ── */}
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 group"
        >
          <ArrowLeft
            size={16}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />
          Voltar para lista
        </button>

        {/* ── Card do Lead ── */}
        <div className="card overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {lead.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">ID: {lead.id}</p>
            </div>
            <button
              onClick={openEditLead}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Pencil size={14} /> Editar
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Mail size={16} className="mr-3 text-slate-400" />
                  {lead.email}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Smartphone size={16} className="mr-3 text-slate-400" />
                  {lead.phone}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar size={16} className="mr-3 text-slate-400" />
                  Criado em: {format(new Date(lead.createdAt), "dd/MM/yyyy")}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Clock size={16} className="mr-3 text-slate-400" />
                  Tempo até 1º contato:{" "}
                  <span className="ml-1 font-medium text-slate-800">
                    {timeToFirstContact ?? "Sem negociações"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Tag size={16} className="mr-3 text-slate-400" />
                  Origem: {lead.origin}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
              <span className={`badge ${statusColors[lead.status]}`}>
                {lead.status}
              </span>
              <span className={`badge ${importanceColors[lead.importance]}`}>
                {lead.importance}
              </span>
              {lead.store && (
                <span className="badge bg-slate-100 text-slate-700">
                  {STORES.find((s) => s.value === lead.store)?.label ??
                    lead.store}
                </span>
              )}
              {lead.assignedTo && (
                <span className="badge bg-slate-100 text-slate-700">
                  <User size={11} className="inline mr-1" />
                  Resp: {lead.assignedTo}
                </span>
              )}
              {hasActiveNegotiation && (
                <span className="badge bg-emerald-100 text-emerald-700 flex items-center">
                  <CheckCircle size={12} className="mr-1" /> Negociação ativa
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stepper de status ── */}
        {(() => {
          const steps: { key: Lead["status"]; label: string }[] = [
            { key: "novo",        label: "Novo" },
            { key: "contatado",   label: "Contatado" },
            { key: "qualificado", label: "Qualificado" },
            { key: "ganho",       label: "Ganho" },
          ];
          const isLost = lead.status === "perdido";
          const activeIdx = isLost ? -1 : steps.findIndex((s) => s.key === lead.status);
          return (
            <div className="card p-5 mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Progresso do Lead
              </p>
              {isLost ? (
                <div className="flex items-center gap-2 text-rose-600 text-sm font-medium">
                  <span className="h-3 w-3 rounded-full bg-rose-500 flex-shrink-0" />
                  Lead perdido
                </div>
              ) : (
                <div className="flex items-center gap-0">
                  {steps.map((step, idx) => {
                    const done    = idx < activeIdx;
                    const current = idx === activeIdx;
                    return (
                      <div key={step.key} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                              done    ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                              : current ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-white"
                              : "border-slate-200 text-slate-400 bg-white"
                            }`}
                          >
                            {done ? "✓" : idx + 1}
                          </div>
                          <span className={`text-xs mt-1 font-medium ${current ? "text-[var(--color-primary)]" : done ? "text-slate-700" : "text-slate-400"}`}>
                            {step.label}
                          </span>
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mb-5 rounded ${done ? "bg-[var(--color-primary)]" : "bg-slate-200"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Negociações ── */}
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800">
              Histórico de Negociações
            </h3>
          </div>

          {/* Form nova negociação */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            {hasActiveNegotiation && activeNegotiation ? (
              <div className="space-y-4">
                {/* Painel de progressão da negociação ativa */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <CheckCircle size={13} /> Negociação ativa
                    <span className="ml-auto font-normal capitalize text-emerald-600">
                      Estágio: {stageLabel[activeNegotiation.stage as NegotiationStage] ?? activeNegotiation.stage}
                    </span>
                  </p>

                  {negError && (
                    <div className="mb-3 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                      <AlertCircle size={13} /> {negError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Avançar para estágio</label>
                      <select
                        value={advanceStage}
                        onChange={(e) => setAdvanceStage(e.target.value as NegotiationStage)}
                        className="input w-full text-sm"
                        disabled={advancing}
                      >
                        <option value="primeiro_contato">Primeiro Contato</option>
                        <option value="qualificacao">Qualificação</option>
                        <option value="proposta_enviada">Proposta Enviada</option>
                        <option value="negociacao">Negociação</option>
                        <option value="fechamento">Fechamento</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Temperatura</label>
                      <select
                        value={advanceImp}
                        onChange={(e) => setAdvanceImp(e.target.value as NegotiationImportance)}
                        className="input w-full text-sm"
                        disabled={advancing}
                      >
                        <option value="frio">Frio</option>
                        <option value="morno">Morno</option>
                        <option value="quente">Quente</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleAdvanceStage}
                      disabled={advancing}
                      className="flex items-center gap-1.5 text-sm bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-lg disabled:opacity-50"
                    >
                      {advancing ? <Loader2 size={14} className="animate-spin" /> : <TrendingUp size={14} />}
                      Atualizar estágio
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => {
                        setSelectedNeg(activeNegotiation.id);
                        setShowCloseModal(true);
                      }}
                      className="flex items-center gap-1.5 text-sm bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700"
                    >
                      <CheckCircle size={14} /> Finalizar negociação
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddNegotiation} className="space-y-4">
                {negError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle size={14} />
                    {negError}
                  </div>
                )}
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setNegError("");
                  }}
                  placeholder="Descreva a interação com o lead..."
                  className="input w-full"
                  disabled={sending}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Tipo
                    </label>
                    <select
                      value={negType}
                      onChange={(e) => setNegType(e.target.value as any)}
                      className="input w-full text-sm"
                      disabled={sending}
                    >
                      <option value="comentário">Comentário</option>
                      <option value="proposta">Proposta</option>
                      <option value="contato">Contato</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Importância
                    </label>
                    <select
                      value={negImp}
                      onChange={(e) =>
                        setNegImp(e.target.value as NegotiationImportance)
                      }
                      className="input w-full text-sm"
                      disabled={sending}
                    >
                      <option value="frio">Frio</option>
                      <option value="morno">Morno</option>
                      <option value="quente">Quente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                      Estágio
                    </label>
                    <select
                      value={negStage}
                      onChange={(e) =>
                        setNegStage(e.target.value as NegotiationStage)
                      }
                      className="input w-full text-sm"
                      disabled={sending}
                    >
                      <option value="primeiro_contato">Primeiro Contato</option>
                      <option value="qualificacao">Qualificação</option>
                      <option value="proposta_enviada">Proposta Enviada</option>
                      <option value="negociacao">Negociação</option>
                      <option value="fechamento">Fechamento</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending || !content.trim()}
                    className="btn-primary flex items-center gap-2"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Adicionar
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Timeline de negociações */}
          <div className="p-6">
            {negLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : negotiations && negotiations.length > 0 ? (
              <div className="relative">
                {/* Linha vertical da timeline */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200" />

                <div className="space-y-6">
                  {negotiations.map((item: Negotiation, idx: number) => {
                    const isActive = item.status === "ativa";
                    return (
                      <div key={item.id} className="relative flex items-start gap-4">
                        {/* Dot da timeline */}
                        <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          isActive
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-white border-slate-300"
                        }`}>
                          {isActive ? (
                            <CheckCircle size={14} className="text-white" />
                          ) : (
                            <span className="text-xs font-bold text-slate-400">{negotiations.length - idx}</span>
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div className={`flex-1 min-w-0 rounded-xl border p-4 transition-colors ${
                          isActive
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}>
                          {/* Cabeçalho */}
                          <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                              }`}>
                                {isActive ? <CheckCircle size={11} /> : <Clock size={11} />}
                                {isActive ? "Ativa" : "Encerrada"}
                              </span>
                              <span className={`badge text-xs ${importanceBadge[item.importance as NegotiationImportance] ?? "bg-slate-100 text-slate-600"}`}>
                                {importanceLabel[item.importance as NegotiationImportance] ?? item.importance}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={11} />
                                {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                              </span>
                              {isActive && (
                                <button
                                  onClick={() => { setSelectedNeg(item.id); setShowCloseModal(true); }}
                                  className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                                >
                                  Encerrar
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Estágio */}
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={12} className="text-slate-400 flex-shrink-0" />
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Estágio:</span>
                            <span className="text-xs font-medium text-slate-700">
                              {stageLabel[item.stage as NegotiationStage] ?? item.stage}
                            </span>
                          </div>

                          {/* Observação / Conteúdo da negociação */}
                          {item.content && (
                            <div className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                              {item.content}
                            </div>
                          )}

                          {/* Motivo de finalização — destaque */}
                          {item.closedReason && (
                            <div className={`mt-3 rounded-lg px-4 py-3 border-l-4 ${
                              item.closedReason.toLowerCase().includes("ganho") ||
                              item.closedReason.toLowerCase().includes("contrato") ||
                              item.closedReason.toLowerCase().includes("fechado")
                                ? "bg-emerald-50 border-emerald-400"
                                : "bg-amber-50 border-amber-400"
                            }`}>
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                Motivo de Finalização
                              </p>
                              <p className="text-sm text-slate-700">{item.closedReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600">
                  Nenhuma negociação registrada
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Adicione a primeira interação usando o formulário acima
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Histórico de atividades ── */}
      <div className="card overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-2">
          <History size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-800">Histórico de Atividades</h3>
        </div>
        <div className="p-6">
          {historyLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary)]" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Nenhuma atividade registrada ainda.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-3 bottom-3 w-px bg-slate-100" />
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-4">
                    <div className="relative z-10 w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <p className="text-sm text-slate-700">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{item.userName}</span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-400">
                          {format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal finalizar negociação ── */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              Finalizar negociação
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Selecione o resultado e informe o motivo.
            </p>

            {/* Resultado */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setCloseFinalStatus("GANHA")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  closeFinalStatus === "GANHA"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-500 hover:border-emerald-300"
                }`}
              >
                <CheckCircle size={16} /> Ganho
              </button>
              <button
                onClick={() => setCloseFinalStatus("PERDIDA")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  closeFinalStatus === "PERDIDA"
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-slate-200 text-slate-500 hover:border-rose-300"
                }`}
              >
                <X size={16} /> Perdido
              </button>
            </div>

            {closeFinalStatus === "PERDIDA" ? (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Motivo da perda <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={closePredefinedReason}
                    onChange={(e) => setClosePredefinedReason(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Selecione o motivo...</option>
                    <option value="Preço alto">Preço alto</option>
                    <option value="Concorrente escolhido">Concorrente escolhido</option>
                    <option value="Sem interesse">Sem interesse</option>
                    <option value="Sem retorno do cliente">Sem retorno do cliente</option>
                    <option value="Prazo incompatível">Prazo incompatível</option>
                    <option value="Produto não atende a necessidade">Produto não atende a necessidade</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  placeholder="Detalhes adicionais (opcional)..."
                  className="input w-full"
                />
              </div>
            ) : (
              <textarea
                rows={3}
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="Ex: Contrato assinado, proposta aceita..."
                className="input w-full mb-4"
              />
            )}
            <div className="flex gap-3">
              <button
                onClick={handleCloseNegotiation}
                disabled={!isCloseValid || closingId !== null}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm text-white disabled:opacity-50 ${
                  closeFinalStatus === "GANHA" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {closingId ? (
                  <><Loader2 size={15} className="animate-spin" /> Finalizando...</>
                ) : (
                  <><CheckCircle size={15} /> Confirmar — {closeFinalStatus === "GANHA" ? "Ganho" : "Perdido"}</>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCloseModal(false);
                  setCloseReason("");
                  setClosePredefinedReason("");
                  setSelectedNeg(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal editar lead ── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                Editar Lead
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {editError && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle size={14} />
                  {editError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={editForm.name ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editForm.email ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={editForm.phone ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Status
                  </label>
                  <select
                    value={editForm.status ?? "novo"}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        status: e.target.value as Lead["status"],
                      }))
                    }
                    className="input w-full"
                  >
                    <option value="novo">Novo</option>
                    <option value="contatado">Contatado</option>
                    <option value="qualificado">Qualificado</option>
                    <option value="perdido">Perdido</option>
                    <option value="ganho">Ganho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Importância
                  </label>
                  <select
                    value={editForm.importance ?? "media"}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        importance: e.target.value as Lead["importance"],
                      }))
                    }
                    className="input w-full"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Origem
                  </label>
                  <select
                    value={editForm.origin ?? "Site"}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, origin: e.target.value }))
                    }
                    className="input w-full"
                  >
                    {ORIGINS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Loja
                  </label>
                  <select
                    value={editForm.store ?? "loja1"}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, store: e.target.value }))
                    }
                    className="input w-full"
                  >
                    {STORES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                    Responsável (Atendente)
                  </label>
                  <select
                    value={(editForm as any).assignedToId ?? ""}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, assignedToId: e.target.value }))
                    }
                    className="input w-full"
                  >
                    <option value="">Sem atendente</option>
                    {atendentes.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name ?? a.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveLead}
                disabled={updateLead.isPending}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {updateLead.isPending ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <CheckCircle size={15} />
                )}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
