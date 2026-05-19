import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTeams } from "../../hooks/useTeams";
import { IGetUsersResponse, IUsersService } from "../../services/IUsersService";
import { UserFormData, UserModel } from "./users.type";

type UsersModelProps = {
  usersService: IUsersService;
};

export const useUsersModel = ({ usersService }: UsersModelProps) => {
  const { user: currentUser } = useAuth();

  // Estados de listagem
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [data, setData] = useState<IGetUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserModel | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "atendente",
    teamId: "",
    password: "",
    active: true,
  });

  const { data: teams } = useTeams();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await usersService.getUsers({
          page,
          limit,
          search,
          role: roleFilter || undefined,
          teamId: teamFilter || undefined,
        });

        setData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, search, roleFilter, teamFilter]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleOpenModal = (user?: UserModel) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId || "",
        password: "",
        active: user.active ?? true,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "atendente",
        teamId: "",
        password: "",
        active: true,
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        setIsUpdating(true);
        await usersService.updateUser(editingUser.id, {
          name: formData.name,
          role: formData.role,
          teamId: formData.teamId,
        });
      } else {
        setIsCreating(true);
        await usersService.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      }

      await usersService
        .getUsers({
          page,
          limit,
          search,
          role: roleFilter || undefined,
          teamId: teamFilter || undefined,
        })
        .then(setData);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await usersService.deleteUser(id);
      setDeleteConfirm(null);
      await usersService
        .getUsers({
          page,
          limit,
          search,
          role: roleFilter || undefined,
          teamId: teamFilter || undefined,
        })
        .then(setData);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-700",
    gerente_geral: "bg-indigo-100 text-indigo-700",
    gerente: "bg-blue-100 text-blue-700",
    atendente: "bg-slate-100 text-slate-700",
  };

  const roleLabels = {
    admin: "Administrador",
    gerente_geral: "Gerente Geral",
    gerente: "Gerente",
    atendente: "Atendente",
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, data?.total || 0);

  return {
    currentUser,
    page,
    setPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    teamFilter,
    setTeamFilter,
    showFilters,
    setShowFilters,
    showModal,
    setShowModal,
    editingUser,
    setEditingUser,
    deleteConfirm,
    setDeleteConfirm,
    formData,
    setFormData,
    data,
    isLoading,
    error,
    teams,
    createUser: { isPending: isCreating },
    updateUser: { isPending: isUpdating },
    deleteUser: { isPending: isDeleting },
    handleSearch,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    roleColors,
    roleLabels,
    startItem,
    endItem,
  };
};
