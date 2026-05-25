"use client";

import { TopBar } from "@/components/layout/top-bar";
import { useEvents, useAddEvent, useDeleteEvent } from "@/hooks/use-events";
import { Calendar, Plus, MapPin, Users, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function EventsPage() {
  const { user } = useAuthStore();
  const { data: response, isLoading } = useEvents();
  const addEvent = useAddEvent();
  const deleteEvent = useDeleteEvent();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clubName: "",
    date: "",
    venue: "",
    maxParticipants: 100,
    campusId: user?.campusId || "",
  });

  const eventsList = response?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent.mutate(formData, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ title: "", description: "", clubName: "", date: "", venue: "", maxParticipants: 100, campusId: user?.campusId || "" });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Events & Clubs" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Manage Events</h1>
            {user?.role === "SUPER_ADMIN" || user?.role === "CAMPUS_ADMIN" ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Create Event
              </button>
            ) : null}
          </div>

          {showForm && (
            <div className="soft-surface p-6 rounded-xl border border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Create New Event</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Event Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Club/Organizer Name</label>
                  <input required value={formData.clubName} onChange={e => setFormData({...formData, clubName: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Date & Time</label>
                  <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Venue</label>
                  <input required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Max Participants</label>
                  <input required type="number" min="1" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                {user?.role === "SUPER_ADMIN" && (
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)] uppercase">Campus ID</label>
                    <input required value={formData.campusId} onChange={e => setFormData({...formData, campusId: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                  </div>
                )}
                <div className="col-span-2 space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-20 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="col-span-2 flex justify-end mt-4">
                  <button type="submit" disabled={addEvent.isPending} className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                    {addEvent.isPending ? "Creating..." : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-[var(--text-muted)]">Loading events...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {eventsList.map((event: any) => (
                <div key={event.id} className="soft-surface rounded-xl overflow-hidden border border-[var(--border-subtle)] flex flex-col">
                  <div className="h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center relative">
                    <Calendar size={40} className="text-indigo-400 opacity-50" />
                    {(user?.role === "SUPER_ADMIN" || user?.role === "CAMPUS_ADMIN") && (
                      <button 
                        onClick={() => deleteEvent.mutate(event.id)}
                        className="absolute top-3 right-3 p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-indigo-400 mb-1 uppercase tracking-wider">{event.clubName}</div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 flex-1">{event.description}</p>
                    
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <Calendar size={14} />
                        {new Date(event.date).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <MapPin size={14} />
                        {event.venue}
                      </div>
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)] mt-3">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {event.registeredCount || 0} Registered
                        </div>
                        <div>Max: {event.maxParticipants}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {eventsList.length === 0 && (
                <div className="col-span-full text-center py-10 text-[var(--text-muted)]">
                  No events found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
