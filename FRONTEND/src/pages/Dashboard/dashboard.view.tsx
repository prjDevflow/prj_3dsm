import { AlertCircle, Loader2 } from "lucide-react";
import { Header } from "../../components/Header";
import { DashboardAdmin } from "./components/dashboard.admin";
import { DashboardAtendente } from "./components/dashboard.atendente";
import { DashboardGerente } from "./components/dashboard.gerente";
import { useDashboardModel } from "./dashboard.model";

type DashboardProps = ReturnType<typeof useDashboardModel>;

export const DashboardView = (props: DashboardProps) => {
  const {
    isLoading,
    handleDateRangeChange,
    handleStoreChange,
    handleTeamChange,
    error,
    metrics,
    refetch,
    isAtendente,
    isGerente,
    isAdminOuGerenteGeral,
  } = props;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          onDateRangeChange={handleDateRangeChange}
                  />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
            <p className="text-slate-600">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header
          onDateRangeChange={handleDateRangeChange}
                  />
        <div className="max-w-full px-6 md:px-8 py-8">
          <div className="bg-rose-50 p-8 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
            <p className="text-rose-600">Erro ao carregar dados do dashboard</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ATENDENTE ====================
  if (isAtendente) {
    return <DashboardAtendente {...props} />;
  }

  // ==================== GERENTE ====================
  if (isGerente) {
    return <DashboardGerente {...props} />;
  }

  // ==================== ADMIN OU GERENTE GERAL ====================
  if (isAdminOuGerenteGeral) {
    return <DashboardAdmin {...props} />;
  }
};
