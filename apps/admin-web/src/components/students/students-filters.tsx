"use client";

// ============================================================
// CampusOS AI — Students Filters
// ============================================================

interface StudentsFiltersProps {
  search: string;
  semester: string;
  section: string;
  onSearchChange: (val: string) => void;
  onSemesterChange: (val: string) => void;
  onSectionChange: (val: string) => void;
}

export function StudentsFilters({
  search,
  semester,
  section,
  onSearchChange,
  onSemesterChange,
  onSectionChange,
}: StudentsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or roll..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-colors w-64"
      />

      {/* Semester */}
      <select
        value={semester}
        onChange={(e) => onSemesterChange(e.target.value)}
        className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
      >
        <option value="">All Semesters</option>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <option key={s} value={s}>
            Semester {s}
          </option>
        ))}
      </select>

      {/* Section */}
      <select
        value={section}
        onChange={(e) => onSectionChange(e.target.value)}
        className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
      >
        <option value="">All Sections</option>
        {["A", "B", "C"].map((s) => (
          <option key={s} value={s}>
            Section {s}
          </option>
        ))}
      </select>
    </div>
  );
}
