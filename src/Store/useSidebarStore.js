import { create } from "zustand";

export const useSidebarStore = create((set, get) => ({
  isSidebarOpen: false,

  setIsSidebarOpen: () => {
    set({ isSidebarOpen: !get().isSidebarOpen });
  },
}));
