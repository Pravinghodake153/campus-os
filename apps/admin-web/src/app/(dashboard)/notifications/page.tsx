"use client";

import { TopBar } from "@/components/layout/top-bar";
import { useNotifications, useSendNotification } from "@/hooks/use-notifications";
import { Bell, Plus, Send } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { data: response, isLoading } = useNotifications();
  const sendNotif = useSendNotification();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "GENERAL",
    branchId: "",
  });

  const notifications = response?.data?.notifications || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendNotif.mutate(formData, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ title: "", message: "", type: "GENERAL", branchId: "" });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Notifications" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1000px] mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Send & Manage Notifications</h1>
            {user?.role === "SUPER_ADMIN" || user?.role === "CAMPUS_ADMIN" || user?.role === "HOD" ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Send Notification
              </button>
            ) : null}
          </div>

          {showForm && (
            <div className="soft-surface p-6 rounded-xl border border-[var(--border-subtle)]">
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Broadcast Notification</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Title</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[var(--text-secondary)] uppercase">Message</label>
                  <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full h-24 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)] uppercase">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]">
                      <option value="GENERAL">General</option>
                      <option value="ACADEMIC">Academic</option>
                      <option value="ATTENDANCE">Attendance</option>
                      <option value="PLACEMENT">Placement</option>
                      <option value="EVENT">Event</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--text-secondary)] uppercase">Branch ID (Optional, restricts scope)</label>
                    <input value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})} placeholder="Leave blank to broadcast to all" className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button type="submit" disabled={sendNotif.isPending} className="flex items-center gap-2 px-6 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50">
                    <Send size={16} />
                    {sendNotif.isPending ? "Sending..." : "Broadcast"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-[var(--text-muted)]">Loading notifications...</div>
          ) : (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Notifications</h2>
              {notifications.map((n: any) => (
                <div key={n.id} className="soft-surface rounded-xl p-4 border border-[var(--border-subtle)] flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Bell size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{n.title}</h3>
                      <span className="text-[10px] text-[var(--text-muted)]">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{n.message}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded text-[var(--text-muted)]">
                      {n.type}
                    </span>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-10 text-[var(--text-muted)]">
                  No notifications found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
