import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  energy: number;    
  level: number;     
  xp: number;        

  addXP: (value: number) => void;
  spendEnergy: (value: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      energy: 10,
      level: 1,
      xp: 0,

      addXP: (value) =>
        set((state) => {
          let xp = state.xp + value;
          let level = state.level;

          while (xp >= 1000) {
            xp -= 1000;
            level += 1;
          }

          return { xp, level };
        }),

      spendEnergy: (value) =>
        set((state) => ({
          energy: Math.max(0, state.energy - value),
        })),
    }),

    {
      name: "sparta-player", // ключ в localStorage
    }
  )
);
