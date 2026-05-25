"use client";

import { TopBar } from "@/components/layout/top-bar";
import { useFaculty, useAddFaculty } from "@/hooks/use-faculty";
import { Users, Plus, Mail, Building, Briefcase } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function FacultyPage() {
  const { user } = useAuthStore();
  const { data: response, isLoading } = useFaculty(user?.campusId || undefined);
  const addFaculty = useAddFaculty();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeCode: "",
    designation: "Assistant Professor",
    branchId: "",
    campusId: user?.campusId || "",
    isHOD: false,
  });

  const facultyList = response?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFaculty.mutate(formData, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({
          name: "", email: "", employeeCode: "", designation: "Assistant Professor",
          branchId: "", campusId: user?.campusId || "", isHOD: false
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Faculty Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Faculty & HODs</h1>
            {user?.role === "SUPER_ADMIN" || user?.role === "CAMPUS_ADMIN" ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Faculty
              </button>
            ) : null}
          </div>

          {showForm && (
            <div className="soft-surface p-6 rounded-xl border border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Add New Faculty</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Employee Code</label>
                  <input required value={formData.employeeCode} onChange={e => setFormData({...formData, employeeCode: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Designation</label>
                  <input required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Branch ID</label>
                  <input required value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                {user?.role === "SUPER_ADMIN" && (
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)] uppercase">Campus ID</label>
                    <input required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                  </div>
                )}
                <div className="flex items-center gap-2 col-span-2 mt-2">
                  <input type="checkbox" id="isHOD" checked={formData.isHOD} onChange={e => setFormData({...formData, isHOD: e.target.checked})} className="rounded border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--accent)]" />
                  <label htmlFor="isHOD" className="text-sm text-[var(--text-primary)]">Assign as Head of Department (HOD)</label>
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <button type="submit" disabled={addFaculty.isPending} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                    {addFaculty.isPending ? "Adding..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-[var(--text-muted)]">Loading faculty...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facultyList.map((faculty: any) => (
                <div key={faculty.id} className="soft-surface rounded-xl p-5 border border-[var(--border-subtle)]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center">
                        <Users size={18} className="text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{faculty.user.name}</h3>
                        <p className="text-xs text-[var(--text-muted)]">{faculty.employeeCode}</p>
                      </div>
                    </div>
                    {faculty.user.role === 'HOD' && (
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded">HOD</span>
                    )}
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Briefcase size={14} />
                      {faculty.designation}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Building size={14} />
                      {faculty.branch.code}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <Mail size={14} />
                      {faculty.user.email}
                    </div>
                  </div>
                </div>
              ))}
              {facultyList.length === 0 && (
                <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
                  No faculty found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
