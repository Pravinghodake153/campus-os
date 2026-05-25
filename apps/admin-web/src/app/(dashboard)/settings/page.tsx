"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] p-6">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        
        <div className="flex items-center justify-between py-4 border-b border-[var(--border-subtle)]">
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">Theme Preference</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Choose how CampusOS AI looks to you.
            </p>
          </div>
          
          <div className="flex bg-[var(--bg-primary)] p-1 rounded-lg border border-[var(--border-subtle)]">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                theme === "light"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sun size={16} />
              Light
            </button>
            
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                theme === "dark"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Moon size={16} />
              Dark
            </button>
            
            <button
              onClick={() => setTheme("system")}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                theme === "system"
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Monitor size={16} />
              System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
