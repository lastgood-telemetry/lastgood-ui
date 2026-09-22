import { create } from 'zustand';

export const useOnCallStore = create((set) => ({
  isIncidentMode: false,
  densityMode: 'comfortable', // 'comfortable' | 'compact'
  isCommandPaletteOpen: false,
  activeIncident: {
    id: 'INC-2026-0942',
    title: 'High Latency & DB Connection Pool Saturation in user-auth-service',
    severity: 'P1-CRITICAL',
    startedAt: '2026-09-22T23:15:00Z',
    primaryOnCall: 'Kishan Kumar (@kishan_sre)',
    secondaryOnCall: 'Alex Chen (@alex_devops)',
    impactedServices: ['user-auth-service', 'api-gateway', 'payment-processor'],
    p99Latency: '480ms',
    errorRate: '3.42%',
  },
  toggleIncidentMode: () => set((state) => ({ isIncidentMode: !state.isIncidentMode })),
  setIncidentMode: (val) => set({ isIncidentMode: val }),
  setDensityMode: (mode) => set({ densityMode: mode }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
