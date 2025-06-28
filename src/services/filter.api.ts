import api from "./axios";
import type { FilterMetadata } from "../types/filter.types";

export const fetchFilters = async (): Promise<FilterMetadata> => {
  const res = await api.get<FilterMetadata>("/school/filters/");
  return res.data;
};
