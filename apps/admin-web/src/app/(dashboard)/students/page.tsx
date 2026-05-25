"use client";

// ============================================================
// CampusOS AI — Students Page
// ============================================================

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { StudentsFilters } from "@/components/students/students-filters";
import { StudentsTable } from "@/components/students/students-table";
import { useStudents, useAddStudent } from "@/hooks/use-students";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function StudentsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", rollNumber: "", branchId: "", campusId: user?.campusId || "", semester: 1, section: "A"
  });

  const addStudent = useAddStudent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent.mutate(formData, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ name: "", email: "", rollNumber: "", branchId: "", campusId: user?.campusId || "", semester: 1, section: "A" });
      }
    });
  };

  const { data, isLoading } = useStudents({
    search: search || undefined,
    semester: semester ? Number(semester) : undefined,
    section: section || undefined,
    page,
    limit: 20,
  });

  const students = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Students" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-4">
          {/* Filters */}
          <StudentsFilters
            search={search}
            semester={semester}
            section={section}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            onSemesterChange={(val) => {
              setSemester(val);
              setPage(1);
            }}
            onSectionChange={(val) => {
              setSection(val);
              setPage(1);
            }}
          />

          {/* Total count and Add Button */}
          <div className="flex items-center justify-between">
            {pagination ? (
              <p className="text-xs text-[var(--text-muted)]">
                Showing {students.length} of {pagination.total} students
              </p>
            ) : <div/>}
            {(user?.role === "SUPER_ADMIN" || user?.role === "CAMPUS_ADMIN") && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Student
              </button>
            )}
          </div>

          {showForm && (
            <div className="soft-surface p-6 rounded-xl border border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Add New Student</h2>
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
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Roll Number</label>
                  <input required value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Branch ID</label>
                  <input required value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Semester</label>
                  <input required type="number" min="1" max="8" value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Section</label>
                  <input required value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                {user?.role === "SUPER_ADMIN" && (
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)] uppercase">Campus ID</label>
                    <input required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                  </div>
                )}
                <div className="col-span-2 flex justify-end mt-4">
                  <button type="submit" disabled={addStudent.isPending} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                    {addStudent.isPending ? "Adding..." : "Add Student"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <StudentsTable students={students} isLoading={isLoading} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)]">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p: number) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                  className="flex items-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
