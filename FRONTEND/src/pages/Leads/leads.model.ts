import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { DateRange } from "../../utils/dateUtils";
import { ILead, ILeadsService } from "../../services/ILeadsService";
import { useUsers } from "../../hooks/useUsers";

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
  const isAdmin   = user?.role === "admin";
  const isGerente = user?.role === "gerente" || user?.role === "gerente_geral";

  const [search, setSearch]         = useState("");
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

  // Fetch all leads for the period (large limit for client-side tab filtering)
  const { data: rawData, isLoading, error, refetch } = useQuery({
    queryKey: ["leads", { dateRange, store, team }],
    queryFn: () =>
      leadsService.getLeads({ page: 1, limit: 500, dateRange, store, team }),
    placeholderData: (prev) => prev,
  });

  // Apply search + filters client-side for instant feedback
  const allLeads = rawData?.data ?? [];
  const filteredLeads = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allLeads.filter((l) => {
      if (q) {
        const matchName  = l.name.toLowerCase().includes(q);
        const matchEmail = l.email.toLowerCase().includes(q);
        const matchPhone = l.phone ? l.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) : false;
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      if (importance && l.importance !== importance) return false;
      return true;
    });
  }, [allLeads, search, importance]);

  // Split by tab
  const novosLeads      = filteredLeads.filter((l) => l.status === "novo");
  const andamentoLeads  = filteredLeads.filter((l) => l.status === "contatado" || l.status === "qualificado");
  const finalizadosLeads = filteredLeads.filter((l) => l.status === "ganho" || l.status === "perdido");

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
      store:      lead.store ?? "Matriz Jacareí",
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
      }
      setShowModal(false);
      refetch();
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
  };
};
