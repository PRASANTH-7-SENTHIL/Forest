"use client";

import React from "react";
import { AlertRecord } from "@/types/node";
import { History, Download, CheckCircle, Flame, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertHistoryProps {
  alerts: AlertRecord[];
  onResolveAlert: (alertId: string) => void;
}

export const AlertHistory: React.FC<AlertHistoryProps> = ({ alerts, onResolveAlert }) => {
  const exportToCSV = () => {
    if (alerts.length === 0) return;
    const headers = ["Alert ID", "Date", "Time", "Node ID", "Latitude", "Longitude", "Priority", "Status"];
    const rows = alerts.map((a) => [
      a.id,
      a.date,
      a.time,
      `Node ${a.nodeId}`,
      a.latitude,
      a.longitude,
      a.priority,
      a.resolved ? "Resolved" : "ACTIVE FIRE",
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ForestGuard_Alert_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" /> Historical Wildfire Event Log
          </h3>
          <p className="text-xs font-mono text-emerald-400/70">
            Immutable audit record of all triggered thermal flame & smoke alerts
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Log</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-emerald-900/60 text-emerald-400/80 uppercase tracking-wider">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Trigger Node</th>
              <th className="py-3 px-4">Latitude</th>
              <th className="py-3 px-4">Longitude</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Resolved State</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/30 text-emerald-100">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-emerald-400/60 font-mono">
                  No fire alerts recorded yet. System operational.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-emerald-950/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{alert.id}</td>
                  <td className="py-3.5 px-4">{alert.date}</td>
                  <td className="py-3.5 px-4 text-emerald-300">{alert.time}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">Node {alert.nodeId}</td>
                  <td className="py-3.5 px-4">{alert.latitude.toFixed(6)}</td>
                  <td className="py-3.5 px-4">{alert.longitude.toFixed(6)}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        alert.priority === "Critical"
                          ? "bg-red-950 text-red-400 border border-red-500/50"
                          : alert.priority === "High"
                          ? "bg-amber-950 text-amber-400 border border-amber-500/40"
                          : "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                      )}
                    >
                      {alert.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {alert.resolved ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Resolved
                      </span>
                    ) : (
                      <span className="text-red-400 font-extrabold flex items-center gap-1 animate-pulse">
                        <Flame className="w-3.5 h-3.5 text-red-500" /> UNRESOLVED
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {!alert.resolved && (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px]"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
