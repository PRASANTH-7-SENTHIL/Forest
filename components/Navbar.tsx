"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Clock,
  Radio,
  User,
  Bell,
  Volume2,
  VolumeX,
  Flame,
  TowerControl as RadioTower,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onToggleSidebar: () => void;
  fireCount: number;
  onSimulateFire: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  selectedPoleId: string;
  onSelectPole: (poleId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  fireCount,
  onSimulateFire,
  isMuted,
  onToggleMute,
  selectedPoleId,
  onSelectPole,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass-panel sticky top-0 z-30 px-6 py-3.5 border-b border-emerald-900/40 flex flex-wrap items-center justify-between gap-3">
      {/* Left: Mobile Toggle & Hub Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl glass-card text-emerald-400 hover:bg-emerald-900/50"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-emerald-300 font-semibold tracking-wider">
            LORA MONITORING HUB
          </span>
        </div>
      </div>

      {/* Top Right Pole Selection Control Bar (Pole 1, Pole 2, Pole 3) */}
      <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-2xl border border-emerald-500/30">
        <span className="text-[11px] font-mono font-bold text-emerald-400/80 mr-1 hidden sm:inline">
          Select Pole:
        </span>

        {/* Pole 1 (ThingSpeak Live Real Data) */}
        <button
          onClick={() => onSelectPole("01")}
          className={cn(
            "px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow",
            selectedPoleId === "01"
              ? "bg-emerald-500 text-black shadow-emerald-500/40"
              : "text-emerald-200 hover:bg-emerald-950/80"
          )}
          title="Pole 1: Live Real Data from ThingSpeak Channel 3443686"
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>Pole 1 (Live Real)</span>
        </button>

        {/* Pole 2 (Demo Values) */}
        <button
          onClick={() => onSelectPole("02")}
          className={cn(
            "px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow",
            selectedPoleId === "02"
              ? "bg-emerald-500 text-black shadow-emerald-500/40"
              : "text-emerald-200 hover:bg-emerald-950/80"
          )}
          title="Pole 2: Demo Simulated Sensor Telemetry"
        >
          <RadioTower className="w-3.5 h-3.5" />
          <span>Pole 2 (Demo)</span>
        </button>

        {/* Pole 3 (Demo Values) */}
        <button
          onClick={() => onSelectPole("03")}
          className={cn(
            "px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow",
            selectedPoleId === "03"
              ? "bg-emerald-500 text-black shadow-emerald-500/40"
              : "text-emerald-200 hover:bg-emerald-950/80"
          )}
          title="Pole 3: Demo Simulated Sensor Telemetry"
        >
          <RadioTower className="w-3.5 h-3.5" />
          <span>Pole 3 (Demo)</span>
        </button>
      </div>

      {/* Middle/Right Widgets */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card text-xs font-mono text-emerald-300 border border-emerald-500/20">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>{timeStr || "11:34:05"}</span>
        </div>

        {/* Quick Test Simulation Button */}
        <button
          onClick={onSimulateFire}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md",
            fireCount > 0
              ? "bg-emerald-600 hover:bg-emerald-500 text-black shadow-emerald-500/30"
              : "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-red-500/30 animate-pulse"
          )}
          title="Simulate Fire Alarm Trigger for testing"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{fireCount > 0 ? "Reset Sensors" : "Test Fire Signal"}</span>
        </button>

        {/* Mute/Unmute Audio Siren */}
        <button
          onClick={onToggleMute}
          className="p-2 rounded-xl glass-card text-emerald-400 hover:bg-emerald-950/60 border border-emerald-500/20"
          title={isMuted ? "Unmute Alarm Sound" : "Mute Alarm Sound"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-emerald-900/40">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="font-bold text-white">Forest Commander</div>
            <div className="text-[10px] text-emerald-400/70 font-mono">Range 04 - Sector West</div>
          </div>
        </div>
      </div>
    </header>
  );
};
