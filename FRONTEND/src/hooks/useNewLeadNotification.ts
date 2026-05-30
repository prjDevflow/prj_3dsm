import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/instanceApi";

const POLL_INTERVAL_MS = 30_000;
export const LEAD_CREATED_BY_ME_EVENT = "lead-created-by-me";

const fetchLeadsTotal = async (): Promise<number> => {
  const { data } = await api.get<{ total: number }>("/leads", { params: { page: 1, limit: 1 } });
  return data.total ?? 0;
};

export const useNewLeadNotification = () => {
  const baselineRef  = useRef<number | null>(null);
  const [newCount, setNewCount] = useState(0);

  const { data: total } = useQuery({
    queryKey: ["leads-total-poll"],
    queryFn: fetchLeadsTotal,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (total === undefined) return;
    if (baselineRef.current === null) {
      baselineRef.current = total;
      return;
    }
    const diff = total - baselineRef.current;
    if (diff > 0) setNewCount((prev) => prev + diff);
    baselineRef.current = total;
  }, [total]);

  // When the current user creates a lead themselves, advance the baseline so
  // the badge doesn't fire for their own creation.
  useEffect(() => {
    const handler = () => {
      if (total !== undefined) baselineRef.current = total + 1;
      // Don't show a badge for leads I just created myself
    };
    window.addEventListener(LEAD_CREATED_BY_ME_EVENT, handler);
    return () => window.removeEventListener(LEAD_CREATED_BY_ME_EVENT, handler);
  }, [total]);

  const clearNewLeads = () => {
    setNewCount(0);
    if (total !== undefined) baselineRef.current = total;
  };

  return { newLeadsCount: newCount, clearNewLeads };
};
