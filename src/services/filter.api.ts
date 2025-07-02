import api from "./axios";
import type { FilterMetadata } from "../types/filter.types";

// Updated to accept optional parameters
export const fetchFilters = async (
  params?: Record<string, string>
): Promise<FilterMetadata> => {
  const res = await api.get<FilterMetadata>("/school/filters/", { params });
  return res.data;
};
