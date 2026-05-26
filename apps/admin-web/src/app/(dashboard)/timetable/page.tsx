"use client";

// ============================================================
// CampusOS AI — Timetable Optimizer
// Connected to Python ML Service Constraint-Satisfaction
// ============================================================

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useTimetableGenerate, useTimetableSave } from "@/hooks/use-ai";
import { useDashboard } from "@/hooks/use-dashboard";
import { CalendarClock, Save, Wand2, Clock, MapPin, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TimetableOptimizer() {
  const user = useAuthStore((s) => s.user);
  
  const [semester, setSemester] = useState(1);
  const [section, setSection] = useState("A");
  
  const { data: dashboardData } = useDashboard();
  const branches = dashboardData?.branchWiseAttendance || [];
  
  const [selectedBranchId, setSelectedBranchId] = useState<string>(user?.branchId || "");
  
  // Auto-select first branch if none selected and branches load
  useEffect(() => {
    if (!selectedBranchId && branches.length > 0) {
      setSelectedBranchId(branches[0].branchId);
    }
  }, [branches, selectedBranchId]);

  const selectedCampusId = user?.campusId || branches.find(b => b.branchId === selectedBranchId)?.campusId || "";
  
  const { mutate: generate, isPending: generating, data: response } = useTimetableGenerate();
  const { mutate: save, isPending: saving } = useTimetableSave();

  const handleGenerate = () => {
    if (!selectedCampusId || !selectedBranchId) {
      alert("Missing campus or branch configuration. Please select a branch.");
      return;
    }
    
    generate({
      campusId: selectedCampusId,
      branchId: selectedBranchId,
      semester,
      section
    });
  };

  const handleSave = () => {
    if (!(response as any)?.data?.timetable || !selectedCampusId || !selectedBranchId) return;
    
    save({
      timetable: (response as any).data.timetable,
      campusId: selectedCampusId,
      branchId: selectedBranchId,
      semester,
      section
    }, {
      onSuccess: () => alert("Timetable saved successfully to PostgreSQL!"),
      onError: (err) => alert("Failed to save timetable: " + err.message)
    });
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-12:30", 
    "13:30-14:30", "14:30-15:30", "15:30-16:30"
  ];
  
  const timetable = (response as any)?.data?.timetable;
  const meta = (response as any)?.data?.metadata;

  // Helper to find slot in the result
  const getSlot = (dayName: string, time: string) => {
    if (!timetable) return null;
    const day = timetable.find((d: any) => d.day === dayName);
    if (!day) return null;
    return day.slots.find((s: any) => s.time === time);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <CalendarClock className="text-[var(--accent)]" />
            Timetable Optimizer
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            AI-driven clash-free schedule generation using constraint satisfaction.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm flex flex-wrap items-end gap-4">
        {(!user?.branchId && branches.length > 0) && (
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-1">Branch</label>
            <select 
              value={selectedBranchId} 
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-40 bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            >
              <option value="" disabled>Select Branch</option>
              {branches.map(b => <option key={b.branchId} value={b.branchId}>{b.branchName}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs text-[var(--text-secondary)] mb-1">Semester</label>
          <select 
            value={semester} 
            onChange={(e) => setSemester(Number(e.target.value))}
            className="w-32 bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          >
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-[var(--text-secondary)] mb-1">Section</label>
          <select 
            value={section} 
            onChange={(e) => setSection(e.target.value)}
            className="w-32 bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          >
            {["A", "B", "C"].map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Wand2 size={16} />
          {generating ? "Generating..." : "Generate Timetable"}
        </button>
        
        {timetable && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium ml-auto shadow-lg shadow-green-500/20"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save to Database"}
          </button>
        )}
      </div>

      {/* Metadata */}
      {meta && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Clock size={20} /></div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Generation Time</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{meta.generatedInMs} ms</p>
            </div>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><AlertCircle size={20} /></div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Clashes Avoided</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{meta.clashesAvoided}</p>
            </div>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><CalendarClock size={20} /></div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Slots Assigned</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{meta.totalSlotsAssigned}</p>
            </div>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Wand2 size={20} /></div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Optimization Score</p>
              <p className="text-lg font-semibold text-[var(--text-primary)]">{meta.optimizationScore}/100</p>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      {timetable && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] font-medium w-24">Time</th>
                  {days.map(day => (
                    <th key={day} className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] font-medium text-center min-w-[140px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => {
                  const isLunch = time === "12:00-12:30";
                  return (
                    <tr key={time}>
                      <td className="p-3 border border-[var(--border-subtle)] text-[var(--text-muted)] font-medium whitespace-nowrap bg-[var(--bg-surface-hover)]/30 text-xs">
                        {time}
                      </td>
                      
                      {isLunch ? (
                        <td colSpan={5} className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-center text-[var(--text-muted)] text-xs tracking-widest uppercase opacity-50">
                          Lunch Break
                        </td>
                      ) : (
                        days.map(day => {
                          const slot = getSlot(day, time);
                          return (
                            <td key={`${day}-${time}`} className="p-2 border border-[var(--border-subtle)] align-top h-24 relative group">
                              {slot ? (
                                <div className={cn(
                                  "h-full w-full rounded-md p-2 flex flex-col justify-between border shadow-sm transition-transform group-hover:scale-[1.02]",
                                  slot.type === "LAB" ? "bg-purple-500/10 border-purple-500/20" : "bg-blue-500/10 border-blue-500/20"
                                )}>
                                  <div className="font-semibold text-[var(--text-primary)] text-xs truncate" title={slot.subjectName}>
                                    {slot.subjectCode}
                                  </div>
                                  <div className="mt-auto space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                                      <User size={10} className="shrink-0" />
                                      <span className="truncate">{slot.faculty}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                                      <MapPin size={10} className="shrink-0" />
                                      <span className="truncate font-medium">{slot.room}</span>
                                    </div>
                                  </div>
                                  {slot.type === "LAB" && (
                                    <div className="absolute top-1 right-1 text-[8px] bg-purple-500/20 text-purple-400 px-1 rounded font-bold">LAB</div>
                                  )}
                                </div>
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[var(--border-subtle)] text-xs opacity-50">
                                  Free
                                </div>
                              )}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
