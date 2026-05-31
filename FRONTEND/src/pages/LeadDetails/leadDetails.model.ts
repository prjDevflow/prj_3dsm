import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLead, useNegotiations, useUpdateLead } from "../../hooks/useLeads";
import { useQueryClient } from "@tanstack/react-query";
import { Lead, NegotiationImportance, NegotiationStage } from "../../types";
import { ILeadsService } from "../../services/ILeadsService";
import {
  INegotiationService,
  ICreateNegotiationRequest,
} from "../../services/INegotiationsService";
import { useUsers } from "../../hooks/useUsers";
import { useLojas } from "../../hooks/useLojas";

const ORIGINS = [
  "Site",
  "Google Ads",
  "Facebook",
  "LinkedIn",
  "Instagram",
  "WhatsApp",
  "Indicação",
  "Evento",
  "Telefone",
  "Visita Presencial",
  "Outros",
];

const importanceBadge: Record<NegotiationImportance, string> = {
  frio: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  morno: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  quente: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};
const importanceLabel: Record<NegotiationImportance, string> = {
  frio: "Frio",
  morno: "Morno",
  quente: "Quente",
};
const stageLabel: Record<NegotiationStage, string> = {
  primeiro_contato: "Primeiro Contato",
  qualificacao: "Qualificação",
  proposta_enviada: "Proposta Enviada",
  negociacao: "Negociação",
  fechamento: "Fechamento",
};

type LeadDetailsModelProps = {
  leadsService: ILeadsService;
  negotiationService: INegotiationService;
};

export const useLeadDetailsModel = ({
  leadsService: _leadsService,
  negotiationService,
}: LeadDetailsModelProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Negociação
  const [content, setContent] = useState("");
  const [negType, setNegType] = useState<"comentário" | "proposta" | "contato">(
    "comentário",
  );
  const [negImp, setNegImp] = useState<NegotiationImportance>("frio");
  const [negStage, setNegStage] =
    useState<NegotiationStage>("primeiro_contato");
  const [sending, setSending] = useState(false);
  const [negError, setNegError] = useState("");

  // Fechar negociação
  const [closingId, setClosingId] = useState<string | null>(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [closePredefinedReason, setClosePredefinedReason] = useState("");
  const [closeFinalStatus, setCloseFinalStatus] = useState<"GANHA" | "PERDIDA">("GANHA");
  const [selectedNegotiation, setSelectedNeg] = useState<string | null>(null);

  // Avançar estágio da negociação ativa
  const [advanceStage, setAdvanceStage] = useState<NegotiationStage>("qualificacao");
  const [advanceImp, setAdvanceImp]     = useState<NegotiationImportance>("frio");
  const [advancing, setAdvancing]       = useState(false);

  // Editar lead
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [editError, setEditError] = useState("");
  const updateLead = useUpdateLead();

  const { data: lead, isLoading: leadLoading, error: leadError } = useLead(id!);
  const { data: negotiations, isLoading: negLoading } = useNegotiations(id!);
  const { data: usersData } = useUsers({ limit: 100 });
  const atendentes = (usersData?.data ?? []).filter((u) => u.role === "atendente");
  const { data: lojasData } = useLojas();
  const STORES = (lojasData ?? []).map((l) => ({ value: l.nome, label: l.nome }));

  const activeNegotiation = negotiations?.find((n) => n.status === "ativa");
  const hasActiveNegotiation = !!activeNegotiation;

  const timeToFirstContact = (() => {
    if (!lead || !negotiations || negotiations.length === 0) return null;
    const earliest = negotiations.reduce((a, b) =>
      new Date(a.createdAt) < new Date(b.createdAt) ? a : b
    );
    const diffMs = new Date(earliest.createdAt).getTime() - new Date(lead.createdAt).getTime();
    if (diffMs < 0) return null;
    const hours = diffMs / (1000 * 60 * 60);
    if (hours < 1) return "Menos de 1h";
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.round(hours / 24);
    return `${days} dia${days > 1 ? "s" : ""}`;
  })();

  const statusColors: Record<string, string> = {
    novo: "bg-blue-100 text-blue-700",
    contatado: "bg-amber-100 text-amber-700",
    qualificado: "bg-purple-100 text-purple-700",
    perdido: "bg-rose-100 text-rose-700",
    ganho: "bg-emerald-100 text-emerald-700",
  };
  const importanceColors: Record<string, string> = {
    baixa: "bg-slate-100 text-slate-700",
    media: "bg-indigo-100 text-indigo-700",
    alta: "bg-orange-100 text-orange-700",
  };
  const typeIcons: Record<string, JSX.Element> = {
    // typeIcons: Record<string, JSX.Element> = {
    //   comentário: <MessageSquare size={16} className="text-slate-500" />,
    //   proposta:   <DollarSign   size={16} className="text-emerald-600" />,
    //   contato:    <Phone        size={16} className="text-blue-600" />,
    // };
  };

  const handleAddNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setNegError("Escreva uma mensagem antes de enviar.");
      return;
    }
    if (sending) return;
    setSending(true);
    setNegError("");
    try {
      const createRequest: ICreateNegotiationRequest = {
        leadId: id!,
        importancia: negImp,
        estagio: negStage,
        conteudo: content.trim(),
      };
      await negotiationService.createNegotiation(createRequest);
      setContent("");
      setNegType("comentário");
      setNegImp("frio");
      setNegStage("primeiro_contato");
      await queryClient.invalidateQueries({ queryKey: ["negotiations", id] });
    } catch (err: any) {
      setNegError(
        err.response?.data?.error || err.response?.data?.message || "Erro ao adicionar negociação.",
      );
    } finally {
      setSending(false);
    }
  };

  const isCloseValid = closeFinalStatus === "PERDIDA"
    ? !!closePredefinedReason
    : !!closeReason.trim();

  const buildCloseReason = () => {
    if (closeFinalStatus === "PERDIDA") {
      return closeReason.trim()
        ? `${closePredefinedReason}: ${closeReason.trim()}`
        : closePredefinedReason;
    }
    return closeReason.trim();
  };

  const handleCloseNegotiation = async () => {
    if (!selectedNegotiation || !isCloseValid) return;
    setClosingId(selectedNegotiation);
    setNegError("");
    try {
      await negotiationService.closeNegotiation(selectedNegotiation, buildCloseReason(), closeFinalStatus);
      await queryClient.invalidateQueries({ queryKey: ["negotiations", id] });
      await queryClient.invalidateQueries({ queryKey: ["lead", id] });
      setShowCloseModal(false);
      setCloseReason("");
      setClosePredefinedReason("");
      setSelectedNeg(null);
    } catch (err: any) {
      setNegError(
        err.response?.data?.error || err.response?.data?.message || "Erro ao encerrar negociação.",
      );
    } finally {
      setClosingId(null);
    }
  };

  const handleAdvanceStage = async () => {
    if (!activeNegotiation) return;
    setAdvancing(true);
    setNegError("");
    try {
      await negotiationService.updateNegotiation(activeNegotiation.id, {
        estagioId:  advanceStage,
        importancia: advanceImp,
      });
      await queryClient.invalidateQueries({ queryKey: ["negotiations", id] });
    } catch (err: any) {
      setNegError(
        err.response?.data?.error || err.response?.data?.message || "Erro ao atualizar estágio.",
      );
    } finally {
      setAdvancing(false);
    }
  };

  const openEditLead = () => {
    if (!lead) return;
    setEditForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      importance: lead.importance,
      origin: lead.origin,
      store: lead.store,
      assignedToId: lead.assignedToId ?? "",
    });
    setEditError("");
    setShowEditModal(true);
  };

  const handleSaveLead = async () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      setEditError("Nome e email são obrigatórios.");
      return;
    }
    try {
      const { assignedToId, ...rest } = editForm;
      await updateLead.mutateAsync({
        id: id!,
        ...rest,
        ...(assignedToId ? { assignedTo: assignedToId } : {}),
      });
      setShowEditModal(false);
      await queryClient.invalidateQueries({ queryKey: ["lead", id] });
    } catch {
      setEditError("Erro ao salvar. Tente novamente.");
    }
  };

  return {
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
    typeIcons,
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
  };
};
