import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMarks, updateMark, updateBulkMarks } from "../services/mark.api";
import { toast } from "sonner";
import type { MarksFilterState } from "../types/filter.types";

// Types for the hook parameters
interface UseMarksQueryParams {
  filters: MarksFilterState;
  enabled?: boolean;
  page?: number;
  pageSize?: number;
}

// Hook for fetching marks data
export const useMarksQuery = ({
  filters,
  enabled = true,
  page = 1,
  pageSize = 20,
}: UseMarksQueryParams) => {
  return useQuery({
    queryKey: ["marks", filters, page, pageSize],
    queryFn: () =>
      getMarks({
        ...filters,
        page,
        page_size: pageSize,
      }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    // Remove onError - it's deprecated in newer versions of TanStack Query
    // Use onError in the component instead or handle errors in the component
  });
};

// Hook for updating a single mark
export const useUpdateMarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, mark }: { id: string; mark: number }) =>
      updateMark(id, mark),
    onSuccess: (variables) => {
      // Invalidate and refetch marks query
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      toast.success(`Mark updated successfully for student ${variables.id}`);
    },
    onError: (error, variables) => {
      console.error("Failed to update mark:", error);
      toast.error(`Failed to update mark for student ${variables.id}`);
    },
  });
};

// Hook for bulk updating marks
export const useBulkUpdateMarksMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { slno: string; mark: number }[]) =>
      updateBulkMarks(updates),
    onSuccess: (data) => {
      // Invalidate and refetch marks query
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      console.log("Bulk update successful:", data);
      // Success toast is handled in the component
    },
    onError: (error) => {
      console.error("Failed to bulk update marks:", error);
      // Error toast is handled in the component
      throw error; // Re-throw to let component handle it
    },
  });
};

// Optional: Hook for testing different bulk update endpoints
export const useTestBulkUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { slno: string; mark: number }[]) => {
      // Import the test function dynamically to avoid circular imports
      // const { testBulkUpdateEndpoints } = await import("../services/mark.api");
      // return testBulkUpdateEndpoints(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      toast.success("Bulk update test successful");
    },
    onError: (error) => {
      console.error("All bulk update tests failed:", error);
      toast.error("All bulk update methods failed");
    },
  });
};
