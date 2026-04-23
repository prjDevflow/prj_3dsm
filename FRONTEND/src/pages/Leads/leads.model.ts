import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IGetService } from "../../services/ILeadsService";

type GetLeadsModelProps = {
  getLeadsService: IGetService;
};

export const useLeadsModel = ({ getLeadsService }: GetLeadsModelProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [importance, setImportance] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["leads", { page, limit, search, status, importance }],
    queryFn: () => getLeadsService.exec({ page, limit, search, status, importance }),
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handleFilter = (filters: { status?: string; importance?: string }) => {
    setStatus(filters.status);
    setImportance(filters.importance);
    setPage(1);
  };

  return {
    data,
    isLoading,
    error,
    page,
    setPage,
    search,
    status,
    importance,
    showFilters,
    setShowFilters,
    handleSearch,
    handleFilter,
    limit,
  };
};