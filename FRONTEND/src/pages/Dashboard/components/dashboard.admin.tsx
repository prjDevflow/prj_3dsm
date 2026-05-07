import { AlertCircle, Clock, DollarSign, Phone, Target, TrendingUp, Users } from "lucide-react";
import { Header } from "../../../components/Header";
import KpiCard from "../../../components/KpiCard";
import { useDashboardModel } from "../dashboard.model";
import InteractivePieChart from "../../../components/charts/InteractivePieChart";
import InteractiveLineChart from "../../../components/charts/InteractiveLineChart";
import InteractiveBarChart from "../../../components/charts/InteractiveBarChart";

type DashboardProps = ReturnType<typeof useDashboardModel>;

export const DashboardAdmin = (props: DashboardProps) => {
  const {
    metrics,
    safeArray,
    handleDateRangeChange,
    handleStoreChange,
    handleTeamChange,
    selectedPeriod,
    selectedSource,
    firstName,
    greeting,
    setSelectedPeriod,
    setSelectedSource,
    role,
  } = props;
  const funnel = safeArray(metrics?.funnel);
  const evolution = safeArray(metrics?.evolution);
  const bySource = safeArray(metrics?.bySource);
  const byStatus = safeArray(metrics?.byStatus);
  const byImportance = safeArray(metrics?.byImportance);
  const byStore = safeArray(metrics?.byStore);
  const convertedVsNonConverted = safeArray(metrics?.convertedVsNonConverted);
  const byTeam = safeArray(metrics?.byTeam);
  const performance = safeArray(metrics?.performance);
  const lossReasons = safeArray(metrics?.lossReasons);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onDateRangeChange={handleDateRangeChange}
        onStoreChange={handleStoreChange}
        onTeamChange={handleTeamChange}
      />
      <main className="max-w-full px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">
            {role === "admin" ? "Painel Executivo" : "Painel Gerencial"}
          </h1>
          <p className="text-base text-slate-500 mt-1">
            {greeting}, {firstName}.
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {role === "admin"
              ? "Visão geral completa da operação"
              : "Visão consolidada de todas as equipes"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Total de Leads"
            value={metrics?.kpis.totalLeads || 0}
            icon={Users}
            change={12}
          />
          <KpiCard
            title="Taxa de Conversão"
            value={`${metrics?.kpis.conversionRate || 0}%`}
            icon={Target}
            change={2.5}
          />
          <KpiCard
            title="Ticket Médio"
            value={`R$ ${metrics?.kpis.avgDealValue?.toLocaleString() || 0}`}
            icon={DollarSign}
            change={-1.2}
          />
          <KpiCard
            title="Receita Total"
            value={`R$ ${metrics?.kpis.totalRevenue?.toLocaleString() || 0}`}
            icon={TrendingUp}
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
              Funil de Vendas
            </h3>
            <InteractivePieChart
              data={funnel.map((item) => ({
                name: item.stage,
                value: item.count,
              }))}
            />
          </div>
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Evolução de Leads
            </h3>
            <InteractiveLineChart data={evolution} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Por Origem
            </h3>
            <InteractiveBarChart
              data={bySource.map((item) => ({
                name: item.source,
                value: item.count,
              }))}
              onBarClick={(point) => setSelectedSource(point.name)}
            />
          </div>
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Por Status
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
              Importância
            </h3>
            <InteractiveBarChart
              data={byImportance.map((item) => ({
                name: item.importance,
                value: item.count,
              }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Loja
            </h3>
            <InteractiveBarChart
              data={byStore.map((item) => ({
                name: item.store,
                value: item.count,
              }))}
            />
          </div>
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Convertidos vs Não Convertidos
            </h3>
            <InteractivePieChart data={convertedVsNonConverted} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Equipe
            </h3>
            <InteractiveBarChart
              data={byTeam.map((item) => ({
                name: item.team,
                value: item.count,
              }))}
            />
          </div>
          <div className="card p-7 flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-slate-700">
                Tempo médio até atendimento
              </p>
              <p className="text-3xl font-bold text-slate-800 mt-2">
                {metrics?.avgTimeToFirstContact || "00:00"}
              </p>
            </div>
            <Clock size={36} className="text-slate-400" />
          </div>
        </div>

        <div className="card p-7 mb-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <Phone className="mr-2 h-5 w-5 text-slate-400" />
            Performance dos Atendentes
          </h3>
          <div className="space-y-4">
            {performance.map((agent) => (
              <div key={agent.agent} className="flex items-center">
                <span className="text-sm text-slate-600 w-20">
                  {agent.agent}
                </span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full"
                      style={{
                        width: `${(agent.conversions / agent.leads) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-600">
                  {agent.conversions}/{agent.leads}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-7">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-slate-400" />
            Motivos de Perda
          </h3>
          <div className="space-y-4">
            {lossReasons.map((reason) => (
              <div key={reason.reason} className="flex items-center">
                <span className="text-sm text-slate-600 w-24">
                  {reason.reason}
                </span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{
                        width: `${(reason.count / lossReasons.reduce((acc, r) => acc + r.count, 0)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm text-slate-600">{reason.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-400 text-center">
          <p>
            💡 Dica: Clique nos gráficos para filtrar dados • Use o brush para
            dar zoom • Clique na legenda para ocultar séries
          </p>
        </div>
      </main>
    </div>
  );
};
