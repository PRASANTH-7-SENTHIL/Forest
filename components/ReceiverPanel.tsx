"use client";

import React from "react";
import { ReceiverKitStatus } from "@/types/node";
import { Cpu, Radio, Volume2, VolumeX, Wifi, Thermometer, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceiverPanelProps {
  receiver: ReceiverKitStatus;
}

export const ReceiverPanel: React.FC<ReceiverPanelProps> = ({ receiver }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">LoRa Receiver Hardware Kit</h3>
            <span className="text-[11px] font-mono text-emerald-400/70">
              SX1276 Ground Gateway • 868MHz
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-500/30">
            {receiver.status}
          </span>
        </div>
      </div>

      {/* Hardware Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="glass-card p-3 rounded-xl border border-emerald-500/20">
          <span className="text-emerald-400/70 block text-[10px]">LoRa Signal Strength</span>
          <div className="flex items-center gap-1.5 mt-1 font-bold text-white text-sm">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>{receiver.signalStrength} dBm</span>
          </div>
        </div>

        <div className="glass-card p-3 rounded-xl border border-emerald-500/20">
          <span className="text-emerald-400/70 block text-[10px]">Packets Received</span>
          <div className="flex items-center gap-1.5 mt-1 font-bold text-white text-sm">
            <Radio className="w-4 h-4 text-teal-400" />
            <span>#{receiver.packetsReceived}</span>
          </div>
        </div>

        {/* LED Red & Green */}
        <div className="glass-card p-3 rounded-xl border border-emerald-500/20">
          <span className="text-emerald-400/70 block text-[10px]">LED Status Lights</span>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "w-3 h-3 rounded-full border border-red-400",
                  receiver.ledRed ? "bg-red-500 shadow-md shadow-red-500 animate-pulse" : "bg-red-950 opacity-40"
                )}
              />
              <span className="text-[10px] text-red-300">RED</span>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "w-3 h-3 rounded-full border border-emerald-400",
                  receiver.ledGreen ? "bg-emerald-400 shadow-md shadow-emerald-400" : "bg-emerald-950 opacity-40"
                )}
              />
              <span className="text-[10px] text-emerald-300">GRN</span>
            </div>
          </div>
        </div>

        {/* Hardware Buzzer */}
        <div className="glass-card p-3 rounded-xl border border-emerald-500/20">
          <span className="text-emerald-400/70 block text-[10px]">Piezo Buzzer Alarm</span>
          <div className="flex items-center gap-1.5 mt-1 font-bold text-sm">
            {receiver.buzzer ? (
              <div className="flex items-center gap-1.5 text-red-400 animate-pulse">
                <Volume2 className="w-4 h-4 text-red-500" />
                <span>BUZZER ON</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <VolumeX className="w-4 h-4 text-emerald-500" />
                <span>OFF</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated 16x2 Matrix LCD Screen */}
      <div>
        <div className="text-[11px] font-mono text-emerald-400/80 mb-2 flex items-center justify-between">
          <span>Physical Gateway 16x2 LCD Matrix Display</span>
          <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
            HD44780 SIM
          </span>
        </div>

        <div className="lcd-screen p-4 rounded-xl shadow-inner font-mono text-xs sm:text-sm tracking-wider leading-relaxed">
          <div className="flex items-center justify-between border-b border-emerald-600/40 pb-1 mb-1">
            <span>[RX]: LORA TELEMETRY</span>
            <span>POLE:{receiver.currentNodeId}</span>
          </div>
          <div className="flex justify-between text-emerald-300">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3" /> TEMP:{receiver.currentTemp !== undefined ? `${receiver.currentTemp}°C` : "--"}
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3 h-3" /> HUM:{receiver.currentHumidity !== undefined ? `${receiver.currentHumidity}%` : "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
