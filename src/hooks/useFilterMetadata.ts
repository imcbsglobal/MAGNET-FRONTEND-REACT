import { useQuery } from "@tanstack/react-query";
import { fetchFilters } from "../services/filter.api";

export const useFiltersQuery = () => {
  return useQuery({
    queryKey: ["filters"],
    queryFn: fetchFilters,
    staleTime: 1000 * 60 * 60, // 1 hour cache (filters rarely change)
    retry: 2,
  });
};
