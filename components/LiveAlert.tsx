"use client";

import React from "react";
import { ForestNode } from "@/types/node";
import { Flame, MapPin, Clock, ShieldAlert, CheckCircle, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveAlertProps {
  fireNodes: ForestNode[];
  onResolve: (nodeId: string) => void;
}

export const LiveAlert: React.FC<LiveAlertProps> = ({ fireNodes, onResolve }) => {
  if (fireNodes.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {fireNodes.map((node) => (
          <motion.div
            key={node.nodeId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-alert p-6 rounded-2xl border border-red-500/80 relative overflow-hidden text-red-100"
          >
            {/* Ambient Red Alert Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/50 animate-bounce">
                  <Flame className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      🔥 Forest Fire Detected!
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500 text-black uppercase tracking-wider animate-pulse">
                      CRITICAL PRIORITY
                    </span>
                  </div>

                  <p className="text-xs text-red-200/90 font-mono mt-1">
                    LoRa Telemetry trigger received from Transmitter Node #{node.nodeId}. Immediate ranger dispatch advised.
                  </p>

                  {/* Grid details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-red-500/30 text-xs font-mono">
                    <div>
                      <span className="text-red-300/70 block">Node ID:</span>
                      <span className="font-bold text-white text-sm">Node {node.nodeId}</span>
                    </div>

                    <div>
                      <span className="text-red-300/70 block flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time:
                      </span>
                      <span className="font-bold text-white">{node.lastUpdated}</span>
                    </div>

                    <div>
                      <span className="text-red-300/70 block flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Coordinates:
                      </span>
                      <span className="font-bold text-white">
                        {node.latitude.toFixed(6)}, {node.longitude.toFixed(6)}
                      </span>
                    </div>

                    <div>
                      <span className="text-red-300/70 block flex items-center gap-1">
                        <Radio className="w-3 h-3" /> Signal / Battery:
                      </span>
                      <span className="font-bold text-white">
                        {node.signalStrength} dBm | {node.battery}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onResolve(node.nodeId)}
                  className="w-full md:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span>Acknowledge & Resolve</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};
