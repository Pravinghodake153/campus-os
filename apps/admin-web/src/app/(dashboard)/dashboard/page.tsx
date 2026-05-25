"use client";

// ============================================================
// CampusOS AI — Dashboard Page
// Admin command center with real metrics
// ============================================================

import { TopBar } from "@/components/layout/top-bar";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { useDashboard } from "@/hooks/use-dashboard";
import { useAuthStore } from "@/stores/auth-store";
import { getAttendanceColor } from "@/lib/utils";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  AlertTriangle,
  Briefcase,
  Building,
  Bus,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, error } = useDashboard();

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Welcome */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Welcome back, {user?.name?.split(" ")[0] || "Admin"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="soft-surface p-4 animate-pulse"
                >
                  <div className="h-3 w-20 rounded bg-[var(--bg-elevated)] mb-3" />
                  <div className="h-7 w-16 rounded bg-[var(--bg-elevated)]" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="soft-surface p-4 text-sm text-red-400">
              Failed to load dashboard data. Make sure the API server is
              running.
            </div>
          )}

          {/* Dashboard Content */}
          {data && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                  label="Students"
                  value={data.totalStudents}
                  icon={GraduationCap}
                />
                <MetricCard
                  label="Faculty"
                  value={data.totalFaculty}
                  icon={Users}
                />
                <MetricCard
                  label="Avg Attendance"
                  value={data.averageAttendance}
                  icon={ClipboardCheck}
                  suffix="%"
                  valueColor={getAttendanceColor(data.averageAttendance)}
                />
                <MetricCard
                  label="High Risk"
                  value={data.highRiskStudents}
                  icon={AlertTriangle}
                  valueColor={
                    data.highRiskStudents > 0 ? "text-red-500" : undefined
                  }
                />
                <MetricCard
                  label="Placement Ready"
                  value={data.placementReady}
                  icon={Briefcase}
                />
                <MetricCard
                  label="Hostel Occupancy"
                  value={data.hostelOccupancy}
                  icon={Building}
                  suffix="%"
                />
                <MetricCard
                  label="Transport Routes"
                  value={data.activeTransportRoutes}
                  icon={Bus}
                />
                <MetricCard
                  label="Active Events"
                  value={data.activeEvents}
                  icon={Calendar}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Attendance Chart */}
                <div className="soft-surface p-4">
                  <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                    Branch-wise Attendance
                  </h3>
                  <AttendanceChart data={data.branchWiseAttendance} />
                </div>

                {/* Risk Chart */}
                <div className="soft-surface p-4">
                  <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                    Risk Distribution
                  </h3>
                  <div className="flex items-center justify-center h-[250px]">
                    <RiskChart
                      high={data.highRiskStudents}
                      medium={Math.round(data.totalStudents * 0.25)}
                      low={
                        data.totalStudents -
                        data.highRiskStudents -
                        Math.round(data.totalStudents * 0.25)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="soft-surface p-4">
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                  Recent Alerts
                </h3>
                <AlertsPanel alerts={data.recentAlerts} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
