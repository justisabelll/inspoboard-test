import { create } from 'zustand';

type State = {
  isAuthenticated: boolean;
};

type Action = {
  setAuth: (auth: boolean) => void;
};

export const authStore = create<State & Action>((set) => ({
  isAuthenticated: false,
  setAuth: (auth: boolean) => set({ isAuthenticated: auth }),
}));
