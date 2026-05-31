import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { IClient, IClientsService, ICreateClientRequest, IUpdateClientRequest } from "../../services/IClientsService";
import { useToast } from "../../components/Toast";
import api from "../../services/instanceApi";

type ClientsModelProps = {
  clientsService: IClientsService;
};

type ClientFormData = {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  consultorId?: string;
};

const emptyForm = (): ClientFormData => ({
  name: "",
  email: "",
  phone: "",
  cpf: "",
  consultorId: "",
});

export const useClientsModel = ({ clientsService }: ClientsModelProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isViewAll = isAdmin || user?.role === "gerente" || user?.role === "gerente_geral";
  const limit = 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState<"all" | "with" | "without">("all");
  const handleLeadFilterChange = (f: "all" | "with" | "without") => { setLeadFilter(f); setPage(1); };

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<IClient | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(() => emptyForm());
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const toast = useToast();

  const assignedTo = isViewAll ? undefined : user?.id;

  const hasLeadParam = leadFilter === "with" ? true : leadFilter === "without" ? false : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["clients", { page, limit, search, assignedTo, leadFilter }],
    queryFn: () => clientsService.getClients({ page, limit, search, assignedTo, hasLead: hasLeadParam }),
  });

  const { data: consultores = [] } = useQuery({
    queryKey: ["consultores"],
    queryFn: async () => {
      const { data } = await api.get<{ id: string; name: string; role: string }[]>("/consultores");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const createClientMutation = useMutation<IClient, Error, ICreateClientRequest>({
    mutationFn: (newClient) => clientsService.createClient(newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const updateClientMutation = useMutation<IClient, Error, { id: string; data: Partial<IUpdateClientRequest> }>({
    mutationFn: ({ id, data }) => clientsService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const deleteClientMutation = useMutation<void, Error, string>({
    mutationFn: (id) => clientsService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const clients = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const openCreate = () => {
    setFormData({ ...emptyForm() });
    setEditingClient(null);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (client: IClient) => {
    setFormData({
      name:        client.name,
      email:       client.email,
      phone:       client.phone,
      cpf:         client.cpf,
      consultorId: client.consultorId ?? "",
    });
    setEditingClient(client);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = (field: keyof ClientFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const showFeedback = (msg: string) => {
    toast.success(msg);
    setFormError("");
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setFormError("Nome é obrigatório.");
      return;
    }
    if (!formData.email.trim()) {
      setFormError("Email é obrigatório.");
      return;
    }
    if (!formData.phone?.trim()) {
      setFormError("Telefone é obrigatório.");
      return;
    }

    try {
      if (editingClient) {
        await updateClientMutation.mutateAsync({ id: editingClient.id, data: formData });
        showFeedback("Cliente atualizado com sucesso!");
      } else {
        await createClientMutation.mutateAsync({
          ...formData,
          assignedTo: formData.consultorId || user?.id || "",
          consultorId: formData.consultorId || user?.id || "",
        } as ICreateClientRequest);
        showFeedback("Cliente criado com sucesso!");
      }
      setShowModal(false);
    } catch (err) {
        console.error("Error saving client:", err);
      toast.error("Erro ao salvar cliente. Tente novamente.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClientMutation.mutateAsync(id);
      showFeedback("Cliente removido.");
      setDeleteConfirm(null);
    } catch (err) {
        console.error("Error deleting client:", err);
      setFormError("Erro ao remover cliente.");
    }
  };

  const isSaving = createClientMutation.isPending || updateClientMutation.isPending;

  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];
  
  const avatarColor = (name: string) =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  return {
    clients,
    leads,
    isAdmin,
    page,
    totalPages,
    startItem,
    endItem,
    search,
    setSearch,
    leadFilter,
    setLeadFilter: handleLeadFilterChange,
    isLoading,
    showModal,
    formData,
    setFormData,
    formError,
    success,
    isSaving,
    openCreate,
    openEdit,
    handleSave,
    deleteConfirm,
    setDeleteConfirm,
    handleDelete,
    setPage,
    error,
    closeModal,
    handleFormChange,
    avatarColor,
    total,
    deleteClientMutation,
    editingClient,
    consultores,
  };
};
