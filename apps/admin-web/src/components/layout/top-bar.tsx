"use client";

// ============================================================
// CampusOS AI — Top Bar
// Page title, campus/branch filters, user menu
// ============================================================

import { useAuthStore } from "@/stores/auth-store";
import { useFilterStore } from "@/stores/filter-store";
import { useLogout } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// For Phase 2 MVP, branches are hardcoded from seed data
// In production, these would come from an API call
const BRANCHES = [
  { id: "all", name: "All Branches", code: "ALL" },
  { id: "cse", name: "Computer Science", code: "CSE" },
  { id: "ece", name: "Electronics & Communication", code: "ECE" },
  { id: "me", name: "Mechanical Engineering", code: "ME" },
  { id: "civil", name: "Civil Engineering", code: "CIVIL" },
];

interface TopBarProps {
  title: string;
}

export function TopBar({ title }: TopBarProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const router = useRouter();
  const {
    selectedBranchId,
    setBranchId,
    isBranchLocked,
  } = useFilterStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const currentBranch = BRANCHES.find((b) => b.id === selectedBranchId) || BRANCHES[0];

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-6 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
      {/* Left — Page title */}
      <h1 className="text-base font-semibold text-[var(--text-primary)]">
        {title}
      </h1>

      {/* Center — Branch filter */}
      <div className="flex items-center gap-3">
        {!isBranchLocked && (
          <select
            value={selectedBranchId || "all"}
            onChange={(e) =>
              setBranchId(e.target.value === "all" ? null : e.target.value)
            }
            className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            {BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code === "ALL" ? "All Branches" : `${b.code} — ${b.name}`}
              </option>
            ))}
          </select>
        )}
        {isBranchLocked && user?.branchName && (
          <span className="rounded-lg bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-muted)] border border-[var(--border-subtle)]">
            {user.branchName}
          </span>
        )}
      </div>

      {/* Right — User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-[var(--text-primary)] truncate max-w-[120px]">
              {user?.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">
              {user?.role?.replace(/_/g, " ")}
            </p>
          </div>
          <ChevronDown size={14} className="text-[var(--text-muted)]" />
        </button>

        {showUserMenu && (
          <div className="absolute right-0 top-full mt-1 w-56 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-lg animate-fade-in z-20">
            <div className="px-3 py-2.5 border-b border-[var(--border-subtle)]">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {user?.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium bg-[var(--accent)]/10 text-[var(--accent)]">
                  {user?.role?.replace(/_/g, " ")}
                </span>
                {user?.campusName && (
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {user.campusName}
                  </span>
                )}
              </div>
            </div>
            <div className="p-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
