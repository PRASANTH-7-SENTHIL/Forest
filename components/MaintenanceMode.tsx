"use client";

import React from "react";
import { Wrench, Shield, Clock, RefreshCw, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export const MaintenanceMode = () => {
  return (
    <div className="relative min-h-screen bg-[#040d08] text-emerald-50 flex items-center justify-center p-6 overflow-hidden font-sans">
      {/* Background Image & Ambient Glow */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040d08]/90 via-[#040d08]/80 to-[#040d08]/95 pointer-events-none" />
      <div className="absolute w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Center Maintenance Glass Card */}
      <div className="relative z-10 glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 max-w-2xl w-full text-center shadow-2xl backdrop-blur-2xl space-y-6">
        {/* Animated Icon Header */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
            <Wrench className="w-10 h-10 animate-bounce" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
        </div>

        {/* Branding */}
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="font-extrabold text-xl tracking-tight text-white">
            FOREST<span className="text-emerald-400">GUARD</span>
          </span>
        </div>

        

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          Pay the remaining amount then only site will open
        </h1>

        {/* Description */}
        <p className="text-emerald-200/75 text-sm sm:text-base leading-relaxed font-mono">
          Contact the admin
        </p>

        
        
      </div>
    </div>
  );
};
