"use client";

import React, { useEffect } from "react";
import { ForestNode } from "@/types/node";
import { Flame, Bell, Volume2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FireToastProps {
  fireNodes: ForestNode[];
  onDismiss: () => void;
}

export const FireToast: React.FC<FireToastProps> = ({ fireNodes, onDismiss }) => {
  if (fireNodes.length === 0) return null;
  const activeNode = fireNodes[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-[2000] max-w-md w-full glass-card-alert p-5 rounded-2xl border border-red-500 shadow-2xl shadow-red-600/40 text-white"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/50 animate-bounce">
            <Flame className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-red-200 tracking-tight flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-red-400 animate-pulse" />
                REALTIME FIRE EMERGENCY
              </span>
              <button
                onClick={onDismiss}
                className="text-xs font-mono text-red-300 hover:text-white px-2 py-0.5 rounded bg-red-950/60"
              >
                Dismiss
              </button>
            </div>

            <p className="text-xs text-red-100 font-mono mt-1 leading-relaxed">
              Node #{activeNode.nodeId} reported thermal ignition at coordinates {activeNode.latitude.toFixed(6)}, {activeNode.longitude.toFixed(6)}.
            </p>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-red-300">
              <span>Time: {activeNode.lastUpdated}</span>
              <span className="font-bold text-white bg-red-600 px-2 py-0.5 rounded">ALARM PLAYING</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
