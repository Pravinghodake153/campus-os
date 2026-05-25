"use client";

// ============================================================
// CampusOS AI — AI Assistant (Admin Web)
// Connected to Python ML Service Natural Language Processor
// ============================================================

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useAiAssistant } from "@/hooks/use-ai";
import { MessageSquareText, Send, Bot, User as UserIcon, Sparkles, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  data?: any;
}

const SUGGESTIONS = [
  "Students below 75% attendance in CSE",
  "Which branch has highest risk?",
  "Generate notice for Google placement drive",
  "What is the hostel occupancy?"
];

export default function AIAssistant() {
  const user = useAuthStore((s) => s.user);
  const { mutate: sendQuery, isPending } = useAiAssistant();
  
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: `Hello ${user?.name || "Admin"}! I am your CampusOS AI Assistant. I can help you analyze attendance, identify at-risk students, or draft notices. What would you like to know?`,
    }
  ]);
  const [copied, setCopied] = useState(false);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent, presetQuery?: string) => {
    e?.preventDefault();
    
    const text = presetQuery || query;
    if (!text.trim() || isPending) return;

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");

    // Send to AI
    sendQuery(text, {
      onSuccess: (res) => {
        const data = res.data || res; // depending on response wrapping
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message || "Here is the information you requested.",
          intent: data.intent,
          data: data.data
        };
        setMessages(prev => [...prev, aiMsg]);
      },
      onError: (err) => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I am currently offline or encountered an error. " + err.message
        }]);
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderData = (msg: Message) => {
    if (!msg.data) return null;

    // Notice Generator
    if (msg.intent === "NOTICE_GENERATE" && msg.data.markdown) {
      return (
        <div className="mt-3 relative bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 font-mono text-xs text-[var(--text-secondary)] whitespace-pre-wrap">
          <button 
            onClick={() => handleCopy(msg.data.markdown)}
            className="absolute top-2 right-2 p-1.5 bg-[var(--bg-surface-hover)] rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          {msg.data.markdown}
        </div>
      );
    }

    // Attendance / Student Query Table
    if ((msg.intent === "ATTENDANCE_QUERY" || msg.intent === "STUDENT_QUERY") && msg.data.students) {
      const students = msg.data.students;
      if (students.length === 0) return null;
      
      return (
        <div className="mt-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[var(--bg-surface-hover)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Branch</th>
                <th className="px-3 py-2 font-medium text-right">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {students.map((s: any, i: number) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-[var(--text-primary)]">{s.user?.name || s.studentId || "Student"}</td>
                  <td className="px-3 py-2 text-[var(--text-secondary)]">{s.branchId?.substring(0,8) || "CSE"}</td>
                  <td className="px-3 py-2 text-right text-[var(--text-primary)] font-medium">
                    <span className={cn(
                      s.attendance_pct < 75 ? "text-red-500" : "text-green-500"
                    )}>{s.attendance_pct?.toFixed(0) || 0}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Risk Query Summary
    if (msg.intent === "RISK_QUERY" && msg.data.totalStudents) {
      return (
        <div className="mt-3 flex gap-3">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex-1 text-center">
            <div className="text-xl font-bold text-red-500">{msg.data.highRiskCount}</div>
            <div className="text-[10px] text-red-500/80 uppercase font-semibold tracking-wider">High Risk</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex-1 text-center">
            <div className="text-xl font-bold text-amber-500">{msg.data.mediumRiskCount}</div>
            <div className="text-[10px] text-amber-500/80 uppercase font-semibold tracking-wider">Medium Risk</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex-1 text-center">
            <div className="text-xl font-bold text-blue-500">{msg.data.totalStudents}</div>
            <div className="text-[10px] text-blue-500/80 uppercase font-semibold tracking-wider">Total Scanned</div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <MessageSquareText className="text-[var(--accent)]" />
          AI Assistant
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Ask questions about campus data in natural language.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl flex flex-col overflow-hidden shadow-sm">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex max-w-[85%] gap-3", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === "user" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
              )}>
                {msg.role === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                msg.role === "user" 
                  ? "bg-[var(--accent)] text-white rounded-tr-none shadow-lg shadow-blue-500/10" 
                  : "bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-none"
              )}>
                <p className="leading-relaxed">{msg.content}</p>
                {renderData(msg)}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex max-w-[85%] gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded-tl-none flex gap-1 items-center h-10">
                <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2 pt-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-hover)]/30 flex gap-2 overflow-x-auto hide-scrollbar">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(undefined, s)}
              disabled={isPending}
              className="whitespace-nowrap px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors flex items-center gap-1.5"
            >
              <Sparkles size={12} className="text-[var(--accent)]" />
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about students, attendance, or risk..."
              disabled={isPending}
              className="w-full bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] rounded-xl pl-4 pr-12 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--text-muted)] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!query.trim() || isPending}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--accent)] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:bg-[var(--border-subtle)] disabled:text-[var(--text-muted)] transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
