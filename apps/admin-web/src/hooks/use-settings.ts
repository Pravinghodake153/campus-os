// ============================================================
// CampusOS AI — useSettings Hook
// Manages global app settings: theme, notifications, etc.
// ============================================================

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeOption = "light" | "dark" | "system";

export interface AppSettings {
  theme: ThemeOption;
  resolvedTheme: string | undefined;
  mounted: boolean;
}

export function useSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeTheme = (newTheme: ThemeOption) => {
    setTheme(newTheme);
  };

  return {
    theme: (theme as ThemeOption) ?? "dark",
    resolvedTheme,
    mounted,
    changeTheme,
  };
}
