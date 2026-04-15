import { useLeadsModel } from "./leads.model";
import { AlertCircle, Filter } from "lucide-react";
import Header from "../../components/Header";
import LeadsTable from "../../components/LeadsTable";

type LeadsViewProps = ReturnType<typeof useLeadsModel>;

export const LeadsView = (props: LeadsViewProps) => {
  const {
    error,
    setShowFilters,
    showFilters,
    data,
    setPage,
    handleFilter,
    handleSearch,
    isLoading,
  } = props;
  if (error) {
    return (
      <div className="min-h-screen bg-primary">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-rose-50 dark:bg-rose-950 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600 dark:text-rose-400">
              Erro ao carregar leads
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-primary transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-primary">Leads</h1>
            <p className="text-sm text-secondary mt-1">
              Gerencie todos os leads do sistema
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter size={16} />
            <span>Filtros</span>
          </button>
        </div>

        <LeadsTable
          leads={data?.data || []}
          total={data?.total || 0}
          page={data?.page || 1}
          limit={data?.limit || 10}
          totalPages={data?.totalPages || 1}
          onPageChange={setPage}
          onSearch={handleSearch}
          onFilter={handleFilter}
          loading={isLoading}
          showFilters={showFilters}
        />
      </main>
    </div>
  );
};
