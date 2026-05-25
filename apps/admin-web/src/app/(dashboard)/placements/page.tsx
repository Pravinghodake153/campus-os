"use client";

import { TopBar } from "@/components/layout/top-bar";
import { Briefcase } from "lucide-react";

export default function PlacementsPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Placements" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="soft-surface p-8 text-center">
            <Briefcase
              size={32}
              className="mx-auto text-[var(--text-muted)] mb-3"
            />
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              Placement Management
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
              Manage placement drives, track eligible students, analyze
              skill-gap data, and monitor application status. Full
              implementation coming in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
