"use client";

import { TopBar } from "@/components/layout/top-bar";
import { useTransportRoutes, useAddTransportRoute } from "@/hooks/use-transport";
import { Bus, Plus, User, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function TransportPage() {
  const { user } = useAuthStore();
  const { data: response, isLoading } = useTransportRoutes(user?.campusId || undefined);
  const addRoute = useAddTransportRoute();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    routeName: "",
    busNumber: "",
    driverName: "",
    driverPhone: "",
    stops: "",
    campusId: user?.campusId || "",
  });

  const routes = response?.routes || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      stops: formData.stops.split(",").map(s => s.trim()).filter(s => s),
    };
    addRoute.mutate(dataToSubmit, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ routeName: "", busNumber: "", driverName: "", driverPhone: "", stops: "", campusId: user?.campusId || "" });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Transport Management" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Transport Routes</h1>
            {user?.role === "SUPER_ADMIN" || user?.role === "CAMPUS_ADMIN" || user?.role === "TRANSPORT_MANAGER" ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Route
              </button>
            ) : null}
          </div>

          {showForm && (
            <div className="soft-surface p-6 rounded-xl border border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Add New Route</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Route Name</label>
                  <input required value={formData.routeName} onChange={e => setFormData({...formData, routeName: e.target.value})} placeholder="e.g., Kothrud to Campus" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Bus Number</label>
                  <input required value={formData.busNumber} onChange={e => setFormData({...formData, busNumber: e.target.value})} placeholder="e.g., MH-12-AB-1234" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Driver Name</label>
                  <input required value={formData.driverName} onChange={e => setFormData({...formData, driverName: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Driver Phone</label>
                  <input required value={formData.driverPhone} onChange={e => setFormData({...formData, driverPhone: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                {user?.role === "SUPER_ADMIN" && (
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)] uppercase">Campus ID</label>
                    <input required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                  </div>
                )}
                <div className="col-span-2 space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Stops (Comma Separated)</label>
                  <textarea required value={formData.stops} onChange={e => setFormData({...formData, stops: e.target.value})} placeholder="e.g., Kothrud, Karve Nagar, Warje, Campus" className="w-full h-20 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <button type="submit" disabled={addRoute.isPending} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                    {addRoute.isPending ? "Adding..." : "Add Route"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-[var(--text-muted)]">Loading routes...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {routes.map((route: any) => (
                <div key={route.id} className="soft-surface rounded-xl p-5 border border-[var(--border-subtle)] flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Bus size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{route.routeName}</h3>
                        <p className="text-sm font-mono text-[var(--text-secondary)] bg-[var(--bg-base)] px-2 py-0.5 rounded border border-[var(--border-subtle)] inline-block mt-1">
                          {route.busNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6 pt-4 border-t border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <User size={16} className="text-[var(--text-muted)]" />
                        {route.driverName}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <Phone size={16} className="text-[var(--text-muted)]" />
                        {route.driverPhone}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-[var(--bg-base)] p-4 rounded-lg border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[var(--text-primary)]">
                      <MapPin size={16} className="text-[var(--accent)]" />
                      Route Stops
                    </div>
                    <div className="relative pl-3 border-l-2 border-[var(--border-subtle)] space-y-3">
                      {route.stops.map((stop: string, index: number) => (
                        <div key={index} className="relative text-sm text-[var(--text-secondary)]">
                          <div className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--accent)]"></div>
                          {stop}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {routes.length === 0 && (
                <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
                  No transport routes found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
