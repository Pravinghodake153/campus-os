// ============================================================
// CampusOS AI — Filter Store (Zustand)
// Campus, branch, and semester filters for the admin dashboard
// ============================================================

import { create } from "zustand";

interface FilterState {
  selectedCampusId: string | null;
  selectedBranchId: string | null;
  selectedSemester: number | null;

  // Whether filters are locked (e.g., HOD can't change branch)
  isBranchLocked: boolean;
  isCampusLocked: boolean;

  setCampusId: (id: string | null) => void;
  setBranchId: (id: string | null) => void;
  setSemester: (semester: number | null) => void;
  initializeFromUser: (
    role: string,
    campusId: string | null,
    branchId: string | null
  ) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  selectedCampusId: null,
  selectedBranchId: null,
  selectedSemester: null,
  isBranchLocked: false,
  isCampusLocked: false,

  setCampusId: (id) =>
    set({ selectedCampusId: id, selectedBranchId: null }),

  setBranchId: (id) => set({ selectedBranchId: id }),

  setSemester: (semester) => set({ selectedSemester: semester }),

  initializeFromUser: (role, campusId, branchId) => {
    const isSuper = role === "SUPER_ADMIN";
    const isCampusAdmin = role === "CAMPUS_ADMIN";

    set({
      selectedCampusId: campusId,
      selectedBranchId: branchId,
      // SUPER_ADMIN can change everything
      // CAMPUS_ADMIN can change branch but not campus
      // HOD and others have both locked
      isCampusLocked: !isSuper,
      isBranchLocked: !isSuper && !isCampusAdmin,
    });
  },

  reset: () =>
    set({
      selectedCampusId: null,
      selectedBranchId: null,
      selectedSemester: null,
      isBranchLocked: false,
      isCampusLocked: false,
    }),
}));
