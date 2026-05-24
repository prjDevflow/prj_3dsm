import { DollarSign, Target, TrendingUp, User } from "lucide-react";
import InteractiveBarChart from "../../../components/charts/InteractiveBarChart";
import InteractiveLineChart from "../../../components/charts/InteractiveLineChart";
import InteractivePieChart from "../../../components/charts/InteractivePieChart";
import { Header } from "../../../components/Header";
import KpiCard from "../../../components/KpiCard";
import { useDashboardModel } from "../dashboard.model";

type DashboardProps = ReturnType<typeof useDashboardModel>;

export const DashboardAtendente = (props: DashboardProps) => {
  const {
    metrics,
    handleDateRangeChange,
    handleStoreChange,
    handleTeamChange,
    selectedPeriod,
    selectedSource,
    firstName,
    safeArray,
    greeting,
    setSelectedPeriod,
    setSelectedSource,
  } = props;

  const bySource = safeArray(metrics?.bySource);
  const byStatus = safeArray(metrics?.byStatus);
  const byImportance = safeArray(metrics?.byImportance);
  const byStore = safeArray(metrics?.byStore);
  const evolution = safeArray(metrics?.evolution);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onDateRangeChange={handleDateRangeChange}
      />
      <main className="max-w-full px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">Meu Painel</h1>
          <p className="text-base text-slate-500 mt-1">
            {greeting}, {firstName}.
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Acompanhe sua performance individual
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Meus Leads"
            value={metrics?.kpis.totalLeads || 0}
            icon={User}
            change={12}
          />
          <KpiCard
            title="Minhas Conversões"
            value={metrics?.kpis.convertedLeads || 0}
            icon={Target}
            change={8}
          />
          <KpiCard
            title="Taxa Pessoal"
            value={`${metrics?.kpis.conversionRate || 0}%`}
            icon={TrendingUp}
            change={2.5}
          />
          <KpiCard
            title="Minha Receita"
            value={`R$ ${metrics?.kpis.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            change={8.3}
          />
        </div>

        {(selectedPeriod || selectedSource) && (
          <div className="mb-4 flex items-center space-x-2">
            <span className="text-xs text-slate-500">Filtros ativos:</span>
            {selectedPeriod && (
              <button
                onClick={() => setSelectedPeriod(null)}
                className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs"
              >
                Período: {selectedPeriod} <span className="ml-1">×</span>
              </button>
            )}
            {selectedSource && (
              <button
                onClick={() => setSelectedSource(null)}
                className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs"
              >
                Origem: {selectedSource} <span className="ml-1">×</span>
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Minha Evolução
            </h3>
            <InteractiveLineChart data={evolution} />
          </div>
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Meus Leads por Origem
            </h3>
            <InteractiveBarChart
              data={bySource.map((item) => ({
                name: item.source,
                value: item.count,
              }))}
              onBarClick={(point) => setSelectedSource(point.name)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Meus Leads por Status
            </h3>
            <InteractiveBarChart
              data={byStatus.map((item) => ({
                name: item.status,
                value: item.count,
              }))}
            />
          </div>
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Minha Importância
            </h3>
            <InteractivePieChart
              data={byImportance.map((item) => ({
                name: item.importance,
                value: item.count,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Meus Leads por Loja
            </h3>
            <InteractiveBarChart
              data={byStore.map((item) => ({
                name: item.store,
                value: item.count,
              }))}
            />
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-400 text-center">
          <p>💡 Dica: Clique nos gráficos para filtrar dados</p>
        </div>
      </main>
    </div>
  );
};
