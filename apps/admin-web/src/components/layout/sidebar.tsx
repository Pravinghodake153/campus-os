"use client";

// ============================================================
// CampusOS AI — Sidebar Navigation
// Role-aware collapsible sidebar
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ClipboardCheck,
  BrainCircuit,
  Briefcase,
  Calendar,
  Building,
  Bus,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  MessageSquareText,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  module: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, module: "dashboard" },
  { label: "Students", href: "/students", icon: GraduationCap, module: "students" },
  { label: "Faculty", href: "/faculty", icon: Users, module: "faculty" },
  { label: "Attendance", href: "/attendance", icon: ClipboardCheck, module: "attendance" },
  { label: "Timetable", href: "/timetable", icon: CalendarClock, module: "timetable" },
  { label: "AI Risk", href: "/ai-risk", icon: BrainCircuit, module: "ai-risk" },
  { label: "AI Assistant", href: "/ai-assistant", icon: MessageSquareText, module: "ai-assistant" },
  { label: "Placements", href: "/placements", icon: Briefcase, module: "placements" },
  { label: "Events", href: "/events", icon: Calendar, module: "events" },
  { label: "Hostel", href: "/hostel", icon: Building, module: "hostel" },
  { label: "Transport", href: "/transport", icon: Bus, module: "transport" },
  { label: "Notifications", href: "/notifications", icon: Bell, module: "notifications" },
  { label: "Settings", href: "/settings", icon: Settings, module: "settings" },
];

// Module permissions — which roles can see which sidebar items
const MODULE_PERMISSIONS: Record<string, string[]> = {
  dashboard: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD"],
  students: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD", "FACULTY"],
  faculty: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD"],
  attendance: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD", "FACULTY"],
  timetable: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD"],
  "ai-risk": ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD", "FACULTY"],
  "ai-assistant": ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD", "FACULTY", "PLACEMENT_OFFICER"],
  placements: ["SUPER_ADMIN", "CAMPUS_ADMIN", "PLACEMENT_OFFICER"],
  events: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD"],
  hostel: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOSTEL_MANAGER"],
  transport: ["SUPER_ADMIN", "CAMPUS_ADMIN", "TRANSPORT_MANAGER"],
  notifications: ["SUPER_ADMIN", "CAMPUS_ADMIN", "HOD"],
  settings: ["SUPER_ADMIN", "CAMPUS_ADMIN"],
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role || "";

  // Filter nav items by user role
  const visibleItems = NAV_ITEMS.filter((item) => {
    const allowed = MODULE_PERMISSIONS[item.module];
    return allowed ? allowed.includes(userRole) : false;
  });

  return (
    <aside
      className={cn(
        "flex flex-col h-screen sticky top-0 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border-subtle)]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)] text-white font-bold text-sm">
          C
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
            CampusOS AI
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors relative",
                    isActive
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-[var(--accent)]" />
                  )}
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-[var(--border-subtle)] p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
