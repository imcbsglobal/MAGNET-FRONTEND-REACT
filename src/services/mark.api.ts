import api from "./axios";
import type { Mark } from "../types/mark.types";

export const getMarks = async (params: Record<string, any>) => {
  const res = await api.get<Mark[]>("/school/marks/", { params });
  return res.data;
};

export const updateMark = async (id: number, mark: number) => {
  const res = await api.patch(`/school/marks/${id}/`, { mark });
  return res.data;
};
