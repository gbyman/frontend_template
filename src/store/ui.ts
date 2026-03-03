import { create } from "zustand";

interface UiState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useUiStore;
