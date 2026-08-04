"use client";

import React from "react";
import { ForestNode } from "@/types/node";
import { Radio, CheckCircle2, Flame, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  nodes: ForestNode[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ nodes }) => {
  const total = nodes.length;
  const fireCount = nodes.filter((n) => n.fire).length;
  const healthyCount = nodes.filter((n) => n.status === "healthy" && !n.fire).length;
  const offlineCount = nodes.filter((n) => n.status === "offline" || n.status === "warning").length;

  const cards = [
    {
      title: "Total Nodes",
      value: total,
      sub: "Active Transmitter Kits",
      icon: Radio,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40",
      border: "border-emerald-500/20",
    },
    {
      title: "Healthy Nodes",
      value: healthyCount,
      sub: "Normal Operation",
      icon: CheckCircle2,
      color: "text-teal-400",
      bg: "bg-teal-950/40",
      border: "border-teal-500/20",
    },
    {
      title: "Fire Detected",
      value: fireCount,
      sub: fireCount > 0 ? "CRITICAL EMERGENCY" : "Zero Threats Detected",
      icon: Flame,
      color: fireCount > 0 ? "text-red-400" : "text-gray-400",
      bg: fireCount > 0 ? "bg-red-950/80 animate-pulse" : "bg-gray-900/40",
      border: fireCount > 0 ? "border-red-500/60 shadow-lg shadow-red-500/20" : "border-gray-800",
      isAlert: fireCount > 0,
    },
    {
      title: "Offline / Warning",
      value: offlineCount,
      sub: "Maintenance Required",
      icon: AlertTriangle,
      color: offlineCount > 0 ? "text-amber-400" : "text-gray-400",
      bg: "bg-amber-950/20",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={cn(
              "glass-panel p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between",
              card.bg,
              card.border
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-200/80">
                {card.title}
              </span>
              <div className={cn("p-2 rounded-xl glass-card", card.color)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className={cn("text-3xl font-extrabold tracking-tight mb-1", card.color)}>
                {card.value}
              </div>
              <div className={cn("text-xs font-mono", card.isAlert ? "text-red-300 font-bold" : "text-emerald-400/60")}>
                {card.sub}
              </div>
            </div>

            {card.isAlert && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 rounded-full blur-xl pointer-events-none" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
