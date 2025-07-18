import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: "coffee", // default theme
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: "loop_theme", // this is the key used in localStorage
        }
    )
);
