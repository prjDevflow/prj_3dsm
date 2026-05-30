import { Clock, Target, TrendingUp, User } from "lucide-react";
import InteractiveBarChart from "../../../components/charts/InteractiveBarChart";
import InteractiveLineChart from "../../../components/charts/InteractiveLineChart";
import InteractivePieChart from "../../../components/charts/InteractivePieChart";
import KpiCard from "../../../components/KpiCard";
import { useDashboardModel } from "../dashboard.model";
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

type DashboardProps = ReturnType<typeof useDashboardModel>;

const ROLE_LABELS: Record<string, string> = {
  atendente:    "Atendente",
  gerente:      "Gerente",
  gerente_geral:"Gerente Geral",
  admin:        "Administrador",
};

export const DashboardAtendente = (props: DashboardProps) => {
  const {
    metrics,
    selectedPeriod,
    selectedSource,
    firstName,
    safeArray,
    greeting,
    role,
    user,
    setSelectedPeriod,
    setSelectedSource,
  } = props;

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
  const byStore = safeArray(metrics?.byStore);
  const evolution = safeArray(metrics?.evolution);

  return (
    <main className="max-w-full px-6 md:px-8 py-8">
        {/* Header card — avatar + identidade + métricas-chave */}
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
              {ROLE_LABELS[role ?? ""] ?? role}
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
            title="Meus Leads"
            value={metrics?.kpis.totalLeads || 0}
            icon={User}
          />
          <KpiCard
            title="Minhas Conversões"
            value={metrics?.kpis.convertedLeads || 0}
            icon={Target}
          />
          <KpiCard
            title="Taxa Pessoal"
            value={`${metrics?.kpis.conversionRate || 0}%`}
            icon={TrendingUp}
          />
          <KpiCard
            title="Tempo Médio de Atendimento"
            value={metrics?.avgTimeToFirstContact || "—"}
            icon={Clock}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card p-5 lg:col-span-2">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Minha Evolução
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Por Origem
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
              Por Status
            </h3>
            <InteractiveBarChart
              data={byStatus.map((item, i) => ({
                name: item.status,
                value: item.count,
                color: VIBRANT[i % VIBRANT.length],
              }))}
            />
          </div>
          <div className="card p-5">
            <h3 className="text-base font-semibold text-slate-700 mb-4">
              Por Loja
            </h3>
            <InteractiveBarChart
              data={byStore.map((item, i) => ({
                name: item.store,
                value: item.count,
                color: VIBRANT[i % VIBRANT.length],
              }))}
            />
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-400 text-center">
          <p>💡 Dica: Clique nos gráficos para filtrar dados</p>
        </div>
    </main>
  );
};
