import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { useTeams } from '../hooks/useTeams';
import { User, UserRole } from '../types';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Users = () => {
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

  // Se não for admin, não renderiza (protegido pela rota, mas segurança extra)
  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Usuários</h1>
            <p className="text-sm text-slate-500 mt-1">
              Gerencie os usuários do sistema
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] transition-colors duration-200 font-medium text-sm flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Novo Usuário</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="border border-slate-200 rounded-lg px-4 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200 font-medium text-sm flex items-center space-x-2"
              >
                <Filter size={16} />
                <span>Filtros</span>
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Papel
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                  >
                    <option value="">Todos</option>
                    <option value="admin">Administrador</option>
                    <option value="gerente_geral">Gerente Geral</option>
                    <option value="gerente">Gerente</option>
                    <option value="atendente">Atendente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Equipe
                  </label>
                  <select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                    className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                  >
                    <option value="">Todas</option>
                    {teams?.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
              <p className="text-sm text-slate-500">Carregando usuários...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <p className="text-rose-600">Erro ao carregar usuários</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Usuário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Papel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Equipe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data?.data.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-medium text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                            {roleLabels[user.role]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {teams?.find(t => t.id === user.teamId)?.name || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {user.active ? (
                            <span className="inline-flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                              <Check size={12} className="mr-1" />
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                              <X size={12} className="mr-1" />
                              Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="p-1 text-slate-400 hover:text-[var(--color-primary)] transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          {user.id !== currentUser?.id && (
                            <>
                              {deleteConfirm === user.id ? (
                                <>
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                                    title="Confirmar exclusão"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="p-1 text-rose-600 hover:text-rose-700 transition-colors"
                                    title="Cancelar"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(user.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {data && data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Mostrando {startItem}-{endItem} de {data.total}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-slate-600 px-2">
                      Página {page} de {data.totalPages}
                    </span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.totalPages}
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                    placeholder="••••••"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Papel *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                  required
                >
                  <option value="atendente">Atendente</option>
                  <option value="gerente">Gerente</option>
                  <option value="gerente_geral">Gerente Geral</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Equipe
                </label>
                <select
                  value={formData.teamId}
                  onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                  className="border border-slate-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-20)] focus:border-[var(--color-primary)]"
                >
                  <option value="">Sem equipe</option>
                  {teams?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {editingUser && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Usuário ativo</p>
                    <p className="text-xs text-slate-500">
                      {formData.active 
                        ? 'Usuário pode acessar o sistema' 
                        : 'Usuário não pode acessar o sistema'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                  </label>
                </div>
              )}

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={createUser.isPending || updateUser.isPending}
                  className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] transition-colors duration-200 font-medium text-sm flex-1 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(createUser.isPending || updateUser.isPending) ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Salvar</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors duration-200 font-medium text-sm flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;