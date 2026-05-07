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

const emptyForm = (): LeadFormData => ({
  name: "",
  email: "",
  phone: "",
  status: "novo",
  importance: "media",
  origin: "Site",
  store: "loja1",
  assignedTo: "",
});

export const useLeadsModel = ({ leadsService }: LeadsModelProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isGerente = user?.role === "gerente" || user?.role === "gerente_geral";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [importance, setImportance] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const [store, setStore] = useState("all");
  const [team, setTeam] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<ILead | null>(null);
  const [formData, setFormData] = useState<LeadFormData>(() => emptyForm());
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const limit = 10;

  const { data: usersData } = useUsers({ limit: 100 });
  const atendentes = useMemo(() => (usersData?.data ?? []).filter((u) => u.role === "atendente"), [usersData]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads", { page, limit, search, status, importance, dateRange, store, team }],
    queryFn: () => leadsService.getLeads({ page, limit, search, status, importance, dateRange, store, team }),
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handleFilter = (filters: { status?: string; importance?: string }) => {
    setStatus(filters.status);
    setImportance(filters.importance);
    setPage(1);
  };

  const onDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setPage(1);
  };

  const onStoreChange = (storeValue: string) => {
    setStore(storeValue);
    setPage(1);
  };

  const onTeamChange = (teamValue: string) => {
    setTeam(teamValue);
    setPage(1);
  };

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
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      importance: lead.importance,
      origin: lead.origin,
      store: lead.store ?? "loja1",
      assignedTo: lead.assignedTo ?? "",
    });
    setEditingLead(lead);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = (field: keyof LeadFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
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
          lojaId: formData.store,
          origemId: formData.origin, // Assuming origin maps to origemId
          atendenteId: formData.assignedTo,
        });
        showFeedback("Lead atualizado com sucesso!");
      } else {
        await leadsService.createLead({
          clienteId: "some-client-id", // This needs to be provided or fetched
          lojaId: formData.store,
          origemId: formData.origin, // Assuming origin maps to origemId
        });
        showFeedback("Lead criado com sucesso!");
      }
      setShowModal(false);
      refetch(); // Refetch leads after save
    } catch (err) {
      console.error("Error saving lead:", err);
      setFormError("Erro ao salvar lead. Tente novamente.");
    }
  };

  // For delete functionality (not explicitly in swagger but good to have a placeholder)
  const handleDeleteLead = async (id: string) => {
    try {
      await leadsService.deleteLead(id);
      showFeedback("Lead deletado com sucesso!");
      refetch();
    } catch (err) {
      console.error("Error deleting lead:", err);
      setFormError("Erro ao deletar lead. Tente novamente.");
    }
  };

  const isSaving = false; // Need to manage loading states for create/update/delete properly
  const canCreate = isAdmin || isGerente || user?.role === "atendente";

  return {
    data,
    isLoading,
    error,
    page,
    setPage,
    search,
    status,
    importance,
    showFilters,
    setShowFilters,
    handleSearch,
    handleFilter,
    limit,
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
    handleDeleteLead, // Expose delete function
  };
};
