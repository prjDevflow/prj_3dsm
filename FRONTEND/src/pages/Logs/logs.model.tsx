import React, { useEffect, useState } from "react";
import { DateRange } from "../../utils/dateUtils";
import { IGetLogsResponse, ILogsService } from "../../services/ILogsService";
import { LogIn, Plus, Pencil, Trash2, LogOut } from "lucide-react";

type LogsModelProps = {
  logsService: ILogsService;
};
export const useLogsModel = ({ logsService }: LogsModelProps) => {
  const actionConfig: Record<
    string,
    { label: string; classes: string; Icon: React.FC<{ size?: number }> }
  > = {
    login: {
      label: "Login",
      classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
      Icon: ({ size }) => <LogIn size={size} />,
    },
    logout: {
      label: "Logout",
      classes: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
      Icon: ({ size }) => <LogOut size={size} />,
    },
    create: {
      label: "Criação",
      classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      Icon: ({ size }) => <Plus size={size} />,
    },
    update: {
      label: "Edição",
      classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      Icon: ({ size }) => <Pencil size={size} />,
    },
    delete: {
      label: "Exclusão",
      classes: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
      Icon: ({ size }) => <Trash2 size={size} />,
    },
  };

  const entityLabels: Record<string, string> = {
    user: "Usuário",
    team: "Equipe",
    lead: "Lead",
    negotiation: "Negociação",
    client: "Cliente",
  };

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [actionFilter, setAction] = useState("");
  const [entityFilter, setEntity] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  });
  const [data, setData] = useState<IGetLogsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);

      try {
        const response = await logsService.getLogs({
          page,
          limit,
          search,
          action: actionFilter || undefined,
          entityType: entityFilter || undefined,
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString(),
        });

        setData(response);
      } catch (error) {
        console.error("Erro ao carregar logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [page, search, actionFilter, entityFilter, dateRange]);

  const logs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const hasFilters = !!(search || actionFilter || entityFilter);

  const clearFilters = () => {
    setSearch("");
    setAction("");
    setEntity("");
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };
  const handleAction = (val: string) => {
    setAction(val);
    setPage(1);
  };
  const handleEntity = (val: string) => {
    setEntity(val);
    setPage(1);
  };

  return {
    actionConfig,
    entityLabels,
    expandedRow,
    setExpandedRow,
    page,
    setPage,
    search,
    setSearch,
    actionFilter,
    setAction,
    entityFilter,
    setEntity,
    dateRange,
    setDateRange,
    logs,
    total,
    totalPages,
    startItem,
    endItem,
    hasFilters,
    clearFilters,
    handleSearch,
    handleAction,
    handleEntity,
    isLoading,
  };
};
