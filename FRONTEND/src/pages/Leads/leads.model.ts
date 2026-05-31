import { useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { LEAD_CREATED_BY_ME_EVENT } from "../../hooks/useNewLeadNotification";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DateRange } from "../../utils/dateUtils";
import { ILead, ILeadsService } from "../../services/ILeadsService";
import { useUsers } from "../../hooks/useUsers";
import { useLojas } from "../../hooks/useLojas";
import api from "../../services/instanceApi";

type LeadsModelProps = {
  leadsService: ILeadsService;
};

type LeadFormData = {
  name: string;
  email: string;
  phone: string;
  status: ILead['status'];
  importance: ILead['importance'];
  origin: string;
  store: string;
  assignedTo: string;
};

export type LeadTab = "novos" | "andamento" | "finalizados";

const emptyForm = (): LeadFormData => ({
  name: "",
  email: "",
  phone: "",
  status: "novo",
  importance: "media",
  origin: "Site",
  store: "Matriz Jacareí",
  assignedTo: "",
});

const TAB_PAGE_SIZE = 10;

export const useLeadsModel = ({ leadsService }: LeadsModelProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin   = user?.role === "admin";
  const isGerente = user?.role === "gerente" || user?.role === "gerente_geral";

  const urlSearch = new URLSearchParams(location.search).get("search") ?? "";
  const [search, setSearch]         = useState(urlSearch);
  const [status, setStatus]         = useState<string | undefined>();
  const [importance, setImportance] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange]   = useState<DateRange>(() => {
    const end   = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const [store, setStore] = useState("all");
  const [team, setTeam]   = useState("all");

  // Tab state
  const [activeTab, setActiveTab] = useState<LeadTab>("novos");
  const [tabPage, setTabPage]     = useState(1);

  const [showModal, setShowModal]       = useState(false);
  const [editingLead, setEditingLead]   = useState<ILead | null>(null);
  const [formData, setFormData]         = useState<LeadFormData>(() => emptyForm());
  const [formError, setFormError]       = useState("");
  const [success, setSuccess]           = useState("");

  const { data: usersData } = useUsers({ limit: 100 });
  const atendentes = useMemo(
    () => (usersData?.data ?? []).filter((u) => u.role === "atendente"),
    [usersData]
  );

  const { data: lojasData } = useLojas();
  const lojas = useMemo(
    () => (lojasData ?? []).map((l) => ({ value: l.nome, label: l.nome })),
    [lojasData]
  );

  // Fetch all leads for the period (large limit for client-side tab filtering)
  const { data: rawData, isLoading, error, refetch } = useQuery({
    queryKey: ["leads", { dateRange, store, team }],
    queryFn: () =>
      leadsService.getLeads({ page: 1, limit: 500, dateRange, store, team }),
    placeholderData: (prev) => prev,
  });

  const allLeads = rawData?.data ?? [];

  // Detecção de duplicatas: verifica email e telefone contra leads já carregados
  const duplicateWarning = useMemo(() => {
    if (!showModal || editingLead) return null;
    const email = formData.email.toLowerCase().trim();
    const phone = formData.phone.replace(/\D/g, '').trim();
    if (email) {
      const match = allLeads.find((l) => l.email?.toLowerCase() === email);
      if (match) return { name: match.name, status: match.status, field: 'email' as const };
    }
    if (phone.length >= 8) {
      const match = allLeads.find((l) => l.phone?.replace(/\D/g, '') === phone);
      if (match) return { name: match.name, status: match.status, field: 'telefone' as const };
    }
    return null;
  }, [formData.email, formData.phone, allLeads, showModal, editingLead]);
  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allLeads.filter((l) => {
      if (q) {
        const matchName     = l.name.toLowerCase().includes(q);
        const matchEmail    = l.email.toLowerCase().includes(q);
        const matchPhone    = l.phone ? l.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) : false;
        const matchAgent    = (l.assignedTo ?? '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchAgent) return false;
      }
      if (importance && l.importance !== importance) return false;
      return true;
    });
  }, [allLeads, search, importance]);

  // Sort newest first so newly created leads appear at the top
  const sortedLeads = useMemo(
    () => [...filteredLeads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [filteredLeads]
  );

  // Split by tab
  const novosLeads      = sortedLeads.filter((l) => l.status === "novo");
  const andamentoLeads  = sortedLeads.filter((l) => l.status === "contatado" || l.status === "qualificado");
  const finalizadosLeads = sortedLeads.filter((l) => l.status === "ganho" || l.status === "perdido");

  const tabLeads = activeTab === "novos"
    ? novosLeads.filter((l) => !status || l.status === status)
    : activeTab === "andamento"
    ? andamentoLeads.filter((l) => !status || l.status === status)
    : finalizadosLeads.filter((l) => !status || l.status === status);

  const tabTotalPages = Math.max(1, Math.ceil(tabLeads.length / TAB_PAGE_SIZE));
  const tabPagedLeads = tabLeads.slice((tabPage - 1) * TAB_PAGE_SIZE, tabPage * TAB_PAGE_SIZE);

  const data = {
    data:       tabPagedLeads,
    total:      tabLeads.length,
    page:       tabPage,
    limit:      TAB_PAGE_SIZE,
    totalPages: tabTotalPages,
  };

  const handleSearch = (term: string) => {
    setSearch(term);
    setTabPage(1);
  };


  const handleFilter = (filters: { status?: string; importance?: string }) => {
    setStatus(filters.status);
    setImportance(filters.importance);
    setTabPage(1);
  };

  const onDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setTabPage(1);
  };

  const onStoreChange = (v: string) => { setStore(v); setTabPage(1); };
  const onTeamChange  = (v: string) => { setTeam(v);  setTabPage(1); };

  const switchTab = (tab: LeadTab) => { setActiveTab(tab); setTabPage(1); };

  const openCreate = () => {
    setFormData({
      ...emptyForm(),
      store: lojas[0]?.value ?? "Matriz Jacareí",
      assignedTo: (!isAdmin && !isGerente) ? user?.id ?? "" : "",
    });
    setEditingLead(null);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (lead: ILead) => {
    setFormData({
      name:       lead.name,
      email:      lead.email,
      phone:      lead.phone,
      status:     lead.status,
      importance: lead.importance,
      origin:     lead.origin,
      store:      lead.store ?? lojas[0]?.value ?? "Matriz Jacareí",
      assignedTo: lead.assignedTo ?? "",
    });
    setEditingLead(lead);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showFeedback = (message: string) => {
    setSuccess(message);
    setFormError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Nome e email são obrigatórios.");
      return;
    }
    try {
      if (editingLead) {
        await leadsService.updateLead(editingLead.id, {
          store:      formData.store,
          origin:     formData.origin,
          assignedTo: formData.assignedTo || undefined,
        });
        showFeedback("Lead atualizado com sucesso!");
        setShowModal(false);
        refetch();
      } else {
        await leadsService.createLead({
          name:       formData.name,
          email:      formData.email,
          phone:      formData.phone,
          store:      formData.store,
          origin:     formData.origin,
          assignedTo: formData.assignedTo || undefined,
        });
        showFeedback("Lead criado com sucesso!");
        setShowModal(false);
        setSearch("");
        setActiveTab("novos");
        setTabPage(1);
        window.dispatchEvent(new CustomEvent(LEAD_CREATED_BY_ME_EVENT));
        await refetch();
      }
    } catch {
      setFormError("Erro ao salvar lead. Tente novamente.");
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await leadsService.deleteLead(id);
      showFeedback("Lead deletado com sucesso!");
      refetch();
    } catch {
      setFormError("Erro ao deletar lead. Tente novamente.");
    }
  };

  // #2 — Export CSV
  const exportCSV = () => {
    const statusLabel: Record<string, string> = { novo: 'Novo', contatado: 'Contatado', qualificado: 'Qualificado', ganho: 'Ganho', perdido: 'Perdido' };
    const impLabel: Record<string, string> = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };
    const headers = ['Nome', 'Email', 'Telefone', 'Status', 'Importância', 'Origem', 'Loja', 'Atendente', 'Criado em'];
    const rows = allLeads.map((l) => [
      l.name, l.email, l.phone ?? '', statusLabel[l.status] ?? l.status,
      impLabel[l.importance] ?? l.importance, l.origin, l.store ?? '',
      l.assignedTo ?? '', format(new Date(l.createdAt), 'dd/MM/yyyy'),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // #21 — Import CSV
  const importFileRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<Record<string, string>[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number; errors: { row: number; reason: string }[] } | null>(null);

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim().toLowerCase());
    return lines.slice(1).map((line) => {
      const vals = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) ?? [];
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = (vals[i] ?? '').replace(/^"|"$/g, '').trim();
      });
      return obj;
    });
  };

  const FIELD_MAP: Record<string, string> = {
    nome: 'name', name: 'name', email: 'email',
    telefone: 'phone', phone: 'phone', fone: 'phone',
    loja: 'store', store: 'store',
    origem: 'origin', origin: 'origin',
    atendente: 'assignedTo', 'assigned to': 'assignedTo', assignedto: 'assignedTo',
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const raw = parseCSV(text);
      const mapped = raw.map((row) => {
        const norm: Record<string, string> = {};
        Object.entries(row).forEach(([k, v]) => { norm[FIELD_MAP[k] ?? k] = v; });
        return norm;
      });
      setImportPreview(mapped);
      setImportResult(null);
      setShowImportModal(true);
    };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  };

  const handleImportSubmit = async () => {
    setImporting(true);
    try {
      const { data } = await api.post('/leads/import', { rows: importPreview });
      setImportResult(data);
      await refetch();
    } catch {
      setImportResult({ created: 0, errors: [{ row: 0, reason: 'Erro ao enviar para o servidor.' }] });
    } finally {
      setImporting(false);
    }
  };

  const isSaving  = false;
  const canCreate = isAdmin || isGerente || user?.role === "atendente";

  return {
    data,
    isLoading,
    error,
    tabPage,
    setPage: setTabPage,
    search,
    status,
    importance,
    showFilters,
    setShowFilters,
    handleSearch,
    handleFilter,
    onDateRangeChange,
    onStoreChange,
    onTeamChange,
    showModal,
    openCreate,
    openEdit,
    closeModal,
    formData,
    handleFormChange,
    formError,
    success,
    handleSave,
    isSaving,
    atendentes,
    isAdmin,
    isGerente,
    canCreate,
    editingLead,
    store,
    team,
    // Tab
    activeTab,
    switchTab,
    counts: {
      novos:       novosLeads.length,
      andamento:   andamentoLeads.length,
      finalizados: finalizadosLeads.length,
    },
    handleDeleteLead,
    lojas,
    duplicateWarning,
    exportCSV,
    importFileRef,
    importPreview,
    showImportModal,
    setShowImportModal,
    importing,
    importResult,
    handleImportFile,
    handleImportSubmit,
  };
};
