import api from "./axios";
import type { Mark } from "../types/mark.types";

interface MarkResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Mark[];
}

// Fetch marks with filters and pagination
export const getMarks = async (
  params: Record<string, any>
): Promise<MarkResponse> => {
  try {
    const res = await api.get<MarkResponse>("/school/marks/", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch marks:", error);
    throw new Error("Failed to fetch marks data");
  }
};

// Update a single mark
export const updateMark = async (id: string, mark: number) => {
  try {
    const res = await api.post(`/school/update-mark/`, {
      slno: id,
      mark: mark,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update mark:", error);
    throw new Error("Failed to update mark");
  }
};

// Primary bulk update function with fallback strategies
// services/mark.api.ts
export const updateBulkMarks = async (
  updates: { slno: string; mark: number }[]
): Promise<any> => {
  if (!updates || updates.length === 0) {
    throw new Error("No updates provided");
  }

  // Filter out invalid values (e.g. missing slno or invalid mark)
  const validUpdates = updates.filter(
    (item) => item.slno && !isNaN(item.mark) && item.mark !== null
  );

  if (validUpdates.length === 0) {
    throw new Error("No valid updates to send");
  }

  const res = await api.patch("/school/bulk_update/", validUpdates);
  return res.data;
};
