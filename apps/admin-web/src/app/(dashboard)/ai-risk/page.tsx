"use client";

// ============================================================
// CampusOS AI — AI Risk Dashboard (Phase 4)
// Connected to Python ML Service
// ============================================================

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useRiskBatch, useRiskModelInfo, useRiskRetrain } from "@/hooks/use-ai";
import { BrainCircuit, AlertTriangle, Activity, RefreshCw, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskPrediction {
  studentId: string;
  studentName: string;
  riskScore: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence?: number;
  studentReasons?: string[];
  recommendations?: string[];
  globalFeatureImportance?: Record<string, number>;
}

export default function AIRiskDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: modelInfo, isLoading: modelLoading } = useRiskModelInfo();
  const { mutate: runPrediction, isPending, data: riskResponse } = useRiskBatch();
  const { mutate: retrain, isPending: retrainPending } = useRiskRetrain();
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const riskData = riskResponse?.data || [];
  const isFallback = riskResponse?.fallback === true;

  const handleRun = () => {
    if (user?.branchId) {
      runPrediction(user.branchId);
    } else {
      alert("Please select a branch first (Admin feature). For demo, assume branch is set.");
      // Fallback for demo if no branchId
      runPrediction("b1d19859-9941-4775-812d-0e42ec165509");
    }
  };

  const handleRetrain = () => {
    if (confirm("This will retrain the Random Forest model on fresh synthetic data. Proceed?")) {
      retrain(undefined, {
        onSuccess: () => alert("Model retrained successfully!"),
        onError: () => alert("Failed to retrain model. Is the AI service running?"),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-[var(--accent)]" />
            AI Intelligence Layer
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Machine Learning Risk Prediction using Random Forest.
          </p>
        </div>
        <div className="flex gap-3">
          {user?.role === "SUPER_ADMIN" && (
            <button
              onClick={handleRetrain}
              disabled={retrainPending}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-surface-hover)] disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={cn(retrainPending && "animate-spin")} />
              Retrain Model
            </button>
          )}
          <button
            onClick={handleRun}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium shadow-lg shadow-blue-500/20"
          >
            <Activity size={18} />
            {isPending ? "Running Model..." : "Run Predictions"}
          </button>
        </div>
      </div>

      {isFallback && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-amber-500">AI Service Unavailable</h3>
            <p className="text-amber-500/80 text-sm mt-1">
              The Python ML service is currently offline. Showing the last computed risk predictions from the PostgreSQL database.
            </p>
          </div>
        </div>
      )}

      {/* Model Info Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-5 shadow-sm">
        <h3 className="text-[var(--text-primary)] font-medium mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-[var(--text-muted)]" />
          Model Metadata
        </h3>
        {modelLoading ? (
          <p className="text-[var(--text-muted)] text-sm">Loading model info...</p>
        ) : modelInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">Algorithm</p>
              <p className="text-[var(--text-primary)] font-medium">Random Forest Classifier</p>
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">Last Trained</p>
              <p className="text-[var(--text-primary)] font-medium">
                {new Date((modelInfo as { last_trained: string }).last_trained).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-1">Persistence</p>
              <p className="text-[var(--text-primary)] font-medium">joblib (disk)</p>
            </div>
          </div>
        ) : (
          <p className="text-[var(--text-muted)] text-sm">Model info unavailable.</p>
        )}
      </div>

      {/* Results */}
      {riskData.length > 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-surface-hover)] border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Risk Score</th>
                  <th className="px-6 py-4 font-medium">Risk Level</th>
                  <th className="px-6 py-4 font-medium">Confidence</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {riskData.map((risk: RiskPrediction) => (
                  <React.Fragment key={risk.studentId}>
                    <tr className="hover:bg-[var(--bg-surface-hover)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--text-primary)]">{risk.studentName || "Student Profile"}</div>
                        <div className="text-[var(--text-muted)] text-xs mt-0.5">ID: {risk.studentId.substring(0,8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[var(--text-primary)]">{risk.riskScore}/100</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold",
                          risk.riskLevel === 'HIGH' ? "bg-red-500/10 text-red-500" :
                          risk.riskLevel === 'MEDIUM' ? "bg-amber-500/10 text-amber-500" :
                          "bg-green-500/10 text-green-500"
                        )}>
                          {risk.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {risk.confidence ? `${(risk.confidence * 100).toFixed(0)}%` : '--'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === risk.studentId ? null : risk.studentId)}
                          className="text-[var(--accent)] hover:text-blue-400 font-medium text-sm transition-colors"
                        >
                          {expandedId === risk.studentId ? "Hide Reasons" : "Explain"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === risk.studentId && (
                      <tr className="bg-[var(--bg-surface-hover)]/30 border-b border-[var(--border-subtle)]">
                        <td colSpan={5} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-[var(--text-primary)] font-medium mb-3 text-sm">Student-Specific Reasons</h4>
                              <ul className="space-y-2">
                                {risk.studentReasons?.map((r: string, i: number) => (
                                  <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                                    <span className="text-[var(--accent)]">•</span> {r}
                                  </li>
                                ))}
                              </ul>
                              
                              <h4 className="text-[var(--text-primary)] font-medium mb-3 mt-6 text-sm">AI Recommendations</h4>
                              <ul className="space-y-2">
                                {risk.recommendations?.map((r: string, i: number) => (
                                  <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                                    <span className="text-green-500">✓</span> {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="text-[var(--text-primary)] font-medium mb-3 text-sm">Global Feature Importance</h4>
                              <div className="space-y-3">
                                {Object.entries(risk.globalFeatureImportance || {}).slice(0, 5).map(([feature, weight]: [string, number]) => (
                                  <div key={feature}>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-[var(--text-secondary)]">{feature}</span>
                                      <span className="text-[var(--text-muted)]">{weight.toFixed(3)}</span>
                                    </div>
                                    <div className="w-full bg-[var(--border-subtle)] rounded-full h-1.5">
                                      <div className="bg-[var(--accent)] h-1.5 rounded-full" style={{ width: `${weight * 200}%` }}></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
