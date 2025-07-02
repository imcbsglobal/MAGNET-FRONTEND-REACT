import { useQuery } from "@tanstack/react-query";
import { fetchFilters } from "../services/filter.api";

interface UseFiltersQueryParams {
  class_field?: string;
  division?: string;
}

export const useFiltersQuery = (params?: UseFiltersQueryParams) => {
  // Only include non-empty parameters
  const cleanParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value && value.trim() !== ""
        )
      )
    : undefined;

  return useQuery({
    queryKey: ["filters", cleanParams], // Include params in query key
    queryFn: () => fetchFilters(cleanParams),
    staleTime: 1000 * 60 * 5, // Reduced to 5 minutes since it now depends on filters
    retry: 2,
  });
};
