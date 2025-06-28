import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMarks, updateMark } from "../services/mark.api";
import type { MarksFilterState } from "../types/filter.types";
import { toast } from "sonner";

interface UseMarksQueryParams {
  filters: MarksFilterState;
  enabled: boolean;
  page?: number;
  pageSize?: number;
}

export const useMarksQuery = ({
  filters,
  enabled,
  page = 1,
  pageSize = 20,
}: UseMarksQueryParams) => {
  return useQuery({
    queryKey: ["marks", filters, page, pageSize], // Include pagination in key
    queryFn: () =>
      getMarks({
        ...filters,
        page,
        page_size: pageSize,
      }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
  });
};

export const useUpdateMarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mark }: { id: string; mark: number }) =>
      updateMark(id, mark),
    onSuccess: () => {
      // Invalidate and refetch marks queries
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      toast.success("Mark updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating mark:", error);
      toast.error("Failed to update mark. Please try again.");
    },
  });
};
