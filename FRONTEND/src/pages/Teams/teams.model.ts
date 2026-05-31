import { Team } from "../../types";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ICreateTeamRequest,
  ITeamsService,
  IUpdateTeamRequest,
} from "../../services/ITeamsService";
import { useUsers } from "../../hooks/useUsers";

type TeamsServiceModelProps = { teamsService: ITeamsService };

export const useTeamsModel = ({ teamsService }: TeamsServiceModelProps) => {
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
  const { user } = useAuth();
  const role = user?.role;
  const isAdmin = role === "admin";
  const isGerente = role === "gerente";

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: usersData } = useUsers({ limit: 100 });
  const allUsers = usersData?.data ?? [];
  const gerentes = allUsers.filter((u) => u.role === "gerente");
  const atendentes = allUsers.filter((u) => u.role === "atendente");

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: "",
    members: [] as string[],
  });

  const visibleTeams = isGerente
    ? teams.filter((t) => t.managerId === user?.id)
    : teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setFormData({ name: "", description: "", managerId: "", members: [] });
    setEditingTeam(null);
    setShowModal(true);
  };

  const openEdit = (team: Team) => {
    setFormData({
      name: team.name,
      description: team.description ?? "",
      managerId: team.managerId ?? "",
      members: [...(team.members ?? [])],
    });
    setEditingTeam(team);
    setShowModal(true);
  };

  const toggleMember = (id: string) =>
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter((m) => m !== id)
        : [...prev.members, id],
    }));

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    try {
      if (editingTeam) {
        const updateData: IUpdateTeamRequest = { ...formData };
        await teamsService.updateTeam(editingTeam.id, updateData);
        showFeedback("Equipe atualizada com sucesso!");
      } else {
        const createData: ICreateTeamRequest = { ...formData };
        await teamsService.createTeam(createData);
        showFeedback("Equipe criada com sucesso!");
      }
      setShowModal(false);
      fetchTeams(); // Atualiza a lista após salvar
    } catch {
      setFormError("Erro ao salvar equipe. Tente novamente.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await teamsService.deleteTeam(id);
      showFeedback("Equipe removida com sucesso!");
      setDeleteConfirm(null);
      fetchTeams(); // Atualiza a lista após deletar
    } catch {
      setFormError("Erro ao remover equipe.");
    }
  };

  const showFeedback = (msg: string) => {
    setSuccess(msg);
    setFormError("");
    setTimeout(() => setSuccess(""), 3000);
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const data = await teamsService.getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
      setFormError("Erro ao carregar equipes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const isSaving = false; // Como não estamos usando react-query, não temos isPending

  return {
    isAdmin,
    isGerente,
    isLoading,
    visibleTeams,
    openCreate,
    success,
    formError,
    search,
    setSearch,
    expandedTeam,
    allUsers,
    avatarColor,
    setExpandedTeam,
    openEdit,
    setDeleteConfirm,
    deleteConfirm,
    handleDelete,
    // deleteTeam,
    showModal,
    editingTeam,
    setShowModal,
    formData,
    setFormData,
    gerentes,
    atendentes,
    toggleMember,
    handleSave,
    isSaving,
  };
};
