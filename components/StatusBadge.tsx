import React from "react";
import { NodeStatus } from "@/types/node";
import { CheckCircle2, Flame, AlertTriangle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: NodeStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case "fire":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-950/80 text-red-400 border border-red-500/50 shadow-md shadow-red-500/20 animate-pulse",
            className
          )}
        >
          <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
          <span>FIRE DETECTED</span>
        </span>
      );
    case "warning":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40",
            className
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>SMOKE WARNING</span>
        </span>
      );
    case "offline":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-400 border border-gray-700",
            className
          )}
        >
          <WifiOff className="w-3.5 h-3.5 text-gray-500" />
          <span>OFFLINE</span>
        </span>
      );
    case "healthy":
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30",
            className
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>NORMAL</span>
        </span>
      );
  }
};
