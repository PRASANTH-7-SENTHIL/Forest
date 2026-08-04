import React from "react";
import { TreePine, Radio } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-darkBg text-white flex flex-col items-center justify-center p-6">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
          <TreePine className="w-10 h-10 text-black" />
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
      </div>

      <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold tracking-wider mb-2">
        <Radio className="w-4 h-4 animate-pulse" />
        <span>INITIALIZING FORESTGUARD LORA MONITORING DASHBOARD...</span>
      </div>
      <p className="text-xs font-mono text-emerald-400/60 max-w-sm text-center">
        Connecting to gateway receiver telemetry & loading GIS map layer.
      </p>
    </div>
  );
}
