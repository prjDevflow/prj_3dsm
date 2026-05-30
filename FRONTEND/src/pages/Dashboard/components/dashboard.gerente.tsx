import { AlertCircle, Clock, Phone, Target, TrendingUp, UsersIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import KpiCard from "../../../components/KpiCard";
import { useDashboardModel } from "../dashboard.model";
import InteractiveLineChart from "../../../components/charts/InteractiveLineChart";
import InteractiveBarChart from "../../../components/charts/InteractiveBarChart";
import InteractivePieChart from "../../../components/charts/InteractivePieChart";
import { useUserAvatar } from "../../../hooks/useUserAvatar";

const ORIGIN_COLORS: Record<string, string> = {
  "WhatsApp":      "#25D366",
  "Facebook":      "#1877F2",
  "Instagram":     "#E1306C",
  "Site":          "#09D8C7",
  "Indicação":     "#17364F",
  "Loja Física":   "#BD0927",
  "Mercado Livre": "#FFE11A",
  "Google Ads":    "#EA4335",
  "LinkedIn":      "#0A66C2",
  "Telefone":      "#8B5CF6",
  "Evento":        "#F97316",
};

const IMPORTANCE_COLORS: Record<string, string> = {
  "frio":   "#3B82F6",
  "morno":  "#F59E0B",
  "quente": "#BD0927",
  "Frio":   "#3B82F6",
  "Morno":  "#F59E0B",
  "Quente": "#BD0927",
  "FRIO":   "#3B82F6",
  "MORNO":  "#F59E0B",
  "QUENTE": "#BD0927",
};

const VIBRANT = ["#09D8C7","#BD0927","#17364F","#F97316","#8B5CF6","#FFE11A","#10B981","#1877F2","#E1306C","#411E3A"];

const ROLE_LABELS: Record<string, string> = {
  atendente:     "Atendente",
  gerente:       "Gerente",
  gerente_geral: "Gerente Geral",
  admin:         "Administrador",
};

type DashboardProps = ReturnType<typeof useDashboardModel>;

export const DashboardGerente = (props: DashboardProps) => {
  const {
    metrics,
    safeArray,
    selectedPeriod,
    selectedSource,
    selectedAgent,
    firstName,
    greeting,
    role,
    user,
    setSelectedPeriod,
    setSelectedSource,
    setSelectedAgent,
  } = props;

  const navigate = useNavigate();
  const avatar = useUserAvatar();
  const fullName = user?.nome || user?.name || firstName;
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join("");

  const bySource = safeArray(metrics?.bySource);
  const byStatus = safeArray(metrics?.byStatus);
  const byImportance = safeArray(metrics?.byImportance);
  const evolution = safeArray(metrics?.evolution);
  const performance = safeArray(metrics?.performance);
  const lossReasons = safeArray(metrics?.lossReasons);

  return (
    <main className="max-w-full px-6 md:px-8 py-8">
        {/* Header card — avatar + identidade + métricas da equipe */}
        <div className="card p-5 mb-8 flex items-center gap-5">
          {avatar ? (
            <img src={avatar} alt="" className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 select-none"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              {greeting}
            </p>
            <h1 className="text-xl font-bold text-slate-800 leading-tight truncate">
              {fullName}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {ROLE_LABELS[role ?? ""] ?? role} · Painel da Equipe
            </p>
          </div>

          <div className="hidden sm:flex items-stretch gap-6 divide-x divide-slate-100">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800 leading-none">
                {metrics?.kpis.totalLeads ?? 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Leads</p>
            </div>
            <div className="pl-6 text-right">
              <p className="text-2xl font-bold text-slate-800 leading-none">
                {metrics?.kpis.convertedLeads ?? 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">Conversões</p>
            </div>
            <div className="pl-6 text-right">
              <p className="text-2xl font-bold leading-none" style={{ color: "var(--color-primary)" }}>
                {metrics?.kpis.conversionRate ?? 0}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Taxa</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard
            title="Leads da Equipe"
            value={metrics?.kpis.totalLeads || 0}
            icon={UsersIcon}
          />
          <KpiCard
            title="Conversões da Equipe"
            value={metrics?.kpis.convertedLeads || 0}
            icon={Target}
          />
          <KpiCard
            title="Taxa da Equipe"
            value={`${metrics?.kpis.conversionRate || 0}%`}
            icon={TrendingUp}
          />
          <KpiCard
            title="Tempo Médio de Atendimento"
            value={metrics?.avgTimeToFirstContact || "—"}
            icon={Clock}
          />
        </div>

        {(selectedPeriod || selectedSource || selectedAgent) && (
          <div className="mb-4 flex items-center space-x-2 flex-wrap gap-2">
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
            {selectedAgent && (
              <button
                onClick={() => setSelectedAgent(null)}
                className="inline-flex items-center px-2 py-1 bg-[var(--color-primary-10)] text-[var(--color-primary)] rounded-md text-xs"
              >
                Atendente: {selectedAgent} <span className="ml-1">×</span>
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Evolução da Equipe
            </h3>
            <InteractiveLineChart data={evolution} />
          </div>
          <div className="card p-5 flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex-shrink-0">
              Importância
            </h3>
            <div className="flex-1 min-h-[300px]">
              <InteractivePieChart
                data={byImportance.map((item) => ({
                  name: item.importance,
                  value: item.count,
                  color: IMPORTANCE_COLORS[item.importance],
                }))}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Origem
            </h3>
            <InteractiveBarChart
              data={bySource.map((item) => ({
                name: item.source,
                value: item.count,
                color: ORIGIN_COLORS[item.source],
              }))}
              onBarClick={(point) => setSelectedSource(point.name)}
            />
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Leads por Status
            </h3>
            <InteractiveBarChart
              data={byStatus.map((item, i) => ({
                name: item.status,
                value: item.count,
                color: VIBRANT[i % VIBRANT.length],
              }))}
            />
          </div>
        </div>

        <div className="card p-5 mb-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <Phone className="mr-2 h-5 w-5 text-slate-400" />
            Taxa de Conversão por Atendente
          </h3>
          <div className="space-y-4">
            {performance.map((agent) => (
              <div
                key={agent.agent}
                className={`group p-2 rounded-lg transition-colors ${selectedAgent === agent.agent ? "bg-slate-100" : "hover:bg-slate-50"}`}
                onClick={() =>
                  setSelectedAgent(
                    selectedAgent === agent.agent ? null : agent.agent,
                  )
                }
              >
                <div className="flex items-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/leads?search=${encodeURIComponent(agent.agent)}`); }}
                    className="text-sm font-medium text-[var(--color-primary)] w-24 text-left hover:underline truncate"
                    title={`Ver leads de ${agent.agent}`}
                  >
                    {agent.agent}
                  </button>
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
                  <span className="text-sm font-semibold text-slate-800">
                    {((agent.conversions / agent.leads) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-end space-x-4 mt-1 text-xs text-slate-500">
                  <span>{agent.leads} leads</span>
                  <span>{agent.conversions} conversões</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-slate-400" />
            Motivos de Finalização
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
            💡 Dica: Clique nos atendentes para filtrar dados • Clique nos
            gráficos para explorar
          </p>
        </div>
    </main>
  );
};
