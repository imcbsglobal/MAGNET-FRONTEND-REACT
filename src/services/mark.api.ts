import api from "./axios";
import type { Mark } from "../types/mark.types";

interface MarkResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Mark[];
}

export const getMarks = async (params: Record<string, any>) => {
  const res = await api.get<MarkResponse>("/school/marks/", { params });
  return res.data;
};

export const updateMark = async (id: string, mark: number) => {
  const res = await api.post(`/school/update-mark/`, {
    slno: id, // ✅ pass slno here
    mark: mark, // ✅ pass mark here
  });
  return res.data;
};
