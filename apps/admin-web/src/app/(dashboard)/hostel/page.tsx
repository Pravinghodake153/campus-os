"use client";

import { TopBar } from "@/components/layout/top-bar";
import { useHostels, useAddHostel } from "@/hooks/use-hostel";
import { Building, Plus, Users, DoorOpen } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function HostelPage() {
  const { user } = useAuthStore();
  const { data: response, isLoading } = useHostels(user?.campusId || undefined);
  const addHostel = useAddHostel();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalRooms: 100,
    occupiedRooms: 0,
    wardenName: "",
    campusId: user?.campusId || "",
  });

  const hostels = response?.hostels || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHostel.mutate(formData, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ name: "", totalRooms: 100, occupiedRooms: 0, wardenName: "", campusId: user?.campusId || "" });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Hostel Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Manage Hostels</h1>
            {user?.role === "SUPER_ADMIN" || user?.role === "CAMPUS_ADMIN" || user?.role === "HOSTEL_MANAGER" ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Hostel
              </button>
            ) : null}
          </div>

          {showForm && (
            <div className="soft-surface p-6 rounded-xl border border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Add New Hostel</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Hostel Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Warden Name</label>
                  <input required value={formData.wardenName} onChange={e => setFormData({...formData, wardenName: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Total Rooms</label>
                  <input required type="number" min="1" value={formData.totalRooms} onChange={e => setFormData({...formData, totalRooms: parseInt(e.target.value)})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Occupied Rooms</label>
                  <input required type="number" min="0" value={formData.occupiedRooms} onChange={e => setFormData({...formData, occupiedRooms: parseInt(e.target.value)})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                {user?.role === "SUPER_ADMIN" && (
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)] uppercase">Campus ID</label>
                    <input required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                  </div>
                )}
                <div className="col-span-2 flex justify-end mt-4">
                  <button type="submit" disabled={addHostel.isPending} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                    {addHostel.isPending ? "Adding..." : "Add Hostel"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-[var(--text-muted)]">Loading hostels...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel: any) => {
                const occupancyRate = (hostel.occupiedRooms / hostel.totalRooms) * 100;
                return (
                  <div key={hostel.id} className="soft-surface rounded-xl p-5 border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Building size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{hostel.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Warden: {hostel.wardenName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-1">
                          <DoorOpen size={16} /> Total Rooms
                        </div>
                        <div className="text-xl font-bold text-[var(--text-primary)]">{hostel.totalRooms}</div>
                      </div>
                      <div className="bg-[var(--bg-base)] p-3 rounded-lg border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-1">
                          <Users size={16} /> Occupied
                        </div>
                        <div className="text-xl font-bold text-[var(--text-primary)]">{hostel.occupiedRooms}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                        <span>Occupancy</span>
                        <span>{occupancyRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-base)] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${occupancyRate > 90 ? 'bg-red-500' : occupancyRate > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${occupancyRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {hostels.length === 0 && (
                <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
                  No hostels found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
