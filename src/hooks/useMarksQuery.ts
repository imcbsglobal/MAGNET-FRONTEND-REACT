import { useQuery } from "@tanstack/react-query";
import { getMarks } from "../services/mark.api";

export const useMarksQuery = (filters: Record<string, any>) => {
  return useQuery({
    queryKey: ["marks", filters],
    queryFn: () => getMarks(filters),
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
};
