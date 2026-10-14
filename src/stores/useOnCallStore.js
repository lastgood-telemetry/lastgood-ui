import { create } from 'zustand';

export const useOnCallStore = create((set) => ({
  densityMode: 'comfortable',
  isCommandPaletteOpen: false,
  isDeclareIncidentOpen: false,
  setDeclareIncidentOpen: (open) => set({ isDeclareIncidentOpen: open }),
  setDensityMode: (mode) => set({ densityMode: mode }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
