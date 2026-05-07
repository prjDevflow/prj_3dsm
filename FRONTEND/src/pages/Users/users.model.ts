export const useUsersModel = () => {
  const { user: currentUser } = useAuth();
  
  // Estados de listagem
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

  // Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'atendente' as UserRole,
    teamId: '',
    password: '',
    active: true,
  });

  const { data, isLoading, error } = useUsers({
    page,
    limit,
    search,
    role: roleFilter || undefined,
    teamId: teamFilter || undefined,
  });

  const { data: teams } = useTeams();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleSearch = () => {
    setPage(1);
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        teamId: user.teamId || '',
        password: '',
        active: user.active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'atendente',
        teamId: '',
        password: '',
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser.id,
          ...formData,
        });
      } else {
        await createUser.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700',
    gerente_geral: 'bg-indigo-100 text-indigo-700',
    gerente: 'bg-blue-100 text-blue-700',
    atendente: 'bg-slate-100 text-slate-700',
  };

  const roleLabels = {
    admin: 'Administrador',
    gerente_geral: 'Gerente Geral',
    gerente: 'Gerente',
    atendente: 'Atendente',
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, data?.total || 0);

  return {};
};
