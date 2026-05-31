import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { IDashboardService } from "../../services/IDashboardService";
import { DashboardViewModel, mapToViewModel } from "./dashboard.type";

type DashModelProps = {
  dashboardService: IDashboardService;
};

export const useDashboardModel = ({ dashboardService }: DashModelProps) => {
  const { user } = useAuth();

  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const [store, setStore] = useState<string>("all");
  const [team, setTeam] = useState<string>("all");
  const [metrics, setMetrics] = useState<DashboardViewModel | null>(null);
  const [prevMetrics, setPrevMetrics] = useState<DashboardViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const startFormatted = dateRange.start.toISOString().split("T")[0];
      const endFormatted   = dateRange.end.toISOString().split("T")[0];

      // Período anterior: mesma duração, imediatamente antes
      const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      const prevEnd   = new Date(dateRange.start); prevEnd.setDate(prevEnd.getDate() - 1);
      const prevStart = new Date(prevEnd);          prevStart.setDate(prevStart.getDate() - days);

      const [data, prevData] = await Promise.all([
        dashboardService.getMetrics({ start: startFormatted, end: endFormatted }),
        dashboardService.getMetrics({
          start: prevStart.toISOString().split("T")[0],
          end:   prevEnd.toISOString().split("T")[0],
        }).catch(() => null), // período anterior pode ser rejeitado por limite de 1 ano
      ]);

      setMetrics(mapToViewModel(data));
      setPrevMetrics(prevData ? mapToViewModel(prevData) : null);
    } catch (err) {
      console.error("Error fetching dashboard metrics:", err);
      setError("Failed to load dashboard metrics.");
    } finally {
      setIsLoading(false);
    }
  };

  const kpiDelta = (current: number, prev: number) => {
    if (!prev) return undefined;
    return Math.round(((current - prev) / prev) * 100);
  };

  useEffect(() => {
    fetchMetrics();
  }, [dateRange, store, team]); // Refetch when dateRange, store, or team changes

  const refetch = () => {
    // Expose refetch function
    fetchMetrics();
  };

  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const role = user?.role;
  const isAtendente = role === "atendente";
  const isGerente = role === "gerente";
  const isAdminOuGerenteGeral = role === "admin" || role === "gerente_geral";

  const firstName = user?.nome?.split(" ")[0] ?? "";
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Bom dia";
    if (h >= 12 && h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const handleDateRangeChange = (range: { start: Date; end: Date }) =>
    setDateRange(range);
  const handleStoreChange = (newStore: string) => setStore(newStore);
  const handleTeamChange = (newTeam: string) => setTeam(newTeam);

  const safeArray = (arr: any[] | undefined) => (Array.isArray(arr) ? arr : []);

  return {
    user,
    dateRange,
    setDateRange,
    store,
    setStore,
    team,
    setTeam,
    metrics,
    prevMetrics,
    kpiDelta,
    isLoading,
    error,
    refetch,
    selectedPeriod,
    setSelectedPeriod,
    selectedSource,
    setSelectedSource,
    selectedAgent,
    setSelectedAgent,
    role,
    isAtendente,
    isGerente,
    isAdminOuGerenteGeral,
    firstName,
    greeting,
    handleDateRangeChange,
    handleStoreChange,
    handleTeamChange,
    safeArray,
  };
};
