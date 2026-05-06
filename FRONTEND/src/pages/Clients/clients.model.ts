import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { IClient, IClientsService, ICreateClientRequest, IUpdateClientRequest } from "../../services/IClientsService";
import { useLeads } from "../../hooks/useLeads";

type ClientsModelProps = {
  clientsService: IClientsService;
};

type ClientFormData = {
  nome: string;
  email: string;
  telefone: string;
  cpf?: string;
  leadId?: string;
};

const emptyForm = (): ClientFormData => ({
  nome: "",
  email: "",
  telefone: "",
  cpf: "",
  leadId: "",
});

export const useClientsModel = ({ clientsService }: ClientsModelProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const limit = 10;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<IClient | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>(() => emptyForm());
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const assignedTo = isAdmin ? undefined : user?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["clients", { page, limit, search, assignedTo }],
    queryFn: () => clientsService.getClients({ page, limit, search, assignedTo }),
  });

  const { data: leadsData } = useLeads({ limit: 100 }); // Assuming useLeads exists and returns lead data
  const leads = leadsData?.data ?? [];

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
      nome: client.nome,
      email: client.email,
      telefone: client.telefone,
      cpf: client.cpf,
      leadId: client.leadId,
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
    setSuccess(msg);
    setFormError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      setFormError("Nome é obrigatório.");
      return;
    }
    if (!formData.email.trim()) {
        setFormError("Email é obrigatório.");
        return;
    }
    if (!formData.telefone?.trim()) {
        setFormError("Telefone é obrigatório.");
        return;
    }

    try {
      if (editingClient) {
        await updateClientMutation.mutateAsync({ id: editingClient.id, data: formData });
        showFeedback("Cliente atualizado com sucesso!");
      } else {
        await createClientMutation.mutateAsync({ ...formData, assignedTo: user?.id ?? "" } as ICreateClientRequest);
        showFeedback("Cliente criado com sucesso!");
      }
      setShowModal(false);
    } catch (err) {
        console.error("Error saving client:", err);
      setFormError("Erro ao salvar cliente. Tente novamente.");
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
    editingClient
  };
};
