import { create } from "zustand";

export type EditMode = "single" | "bulk";

interface SettingsStore {
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  editMode: "single",
  setEditMode: (mode) => set({ editMode: mode }),
}));
