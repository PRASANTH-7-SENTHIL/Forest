"use client";

import React, { useState } from "react";
import { X, Settings, Database, Radio, Check, Cpu } from "lucide-react";
import { ThingSpeakConfig } from "@/types/node";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSourceMode: "simulator" | "firebase" | "thingspeak";
  setDataSourceMode: (mode: "simulator" | "firebase" | "thingspeak") => void;
  thingSpeakConfig: ThingSpeakConfig;
  setThingSpeakConfig: (cfg: ThingSpeakConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  dataSourceMode,
  setDataSourceMode,
  thingSpeakConfig,
  setThingSpeakConfig,
}) => {
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "");
  const [projectId, setProjectId] = useState(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "");
  
  const [tsChannel, setTsChannel] = useState(thingSpeakConfig.channelId);
  const [tsReadKey, setTsReadKey] = useState(thingSpeakConfig.readApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setThingSpeakConfig({
      channelId: tsChannel,
      readApiKey: tsReadKey,
      enabled: dataSourceMode === "thingspeak",
      pollIntervalSec: 5,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-emerald-500/30 text-white space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">ForestGuard Telemetry Settings</h3>
              <span className="text-xs font-mono text-emerald-400/70">
                Configure ThingSpeak, Firebase, or Local Simulator
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-400 hover:bg-emerald-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Data Source Mode Switch */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-emerald-300 block uppercase">
            Data Source Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDataSourceMode("simulator")}
              className={`p-3 rounded-xl border text-xs font-mono font-bold text-left transition-all ${
                dataSourceMode === "simulator"
                  ? "bg-emerald-950 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20"
                  : "glass-card border-emerald-900 text-gray-400 hover:bg-emerald-950/40"
              }`}
            >
              <div className="font-bold text-white mb-1">Simulator</div>
              <div className="text-[10px] text-emerald-400/70">
                Built-in test triggers
              </div>
            </button>

            <button
              onClick={() => setDataSourceMode("thingspeak")}
              className={`p-3 rounded-xl border text-xs font-mono font-bold text-left transition-all ${
                dataSourceMode === "thingspeak"
                  ? "bg-teal-950 border-teal-400 text-teal-300 shadow-md shadow-teal-500/20"
                  : "glass-card border-emerald-900 text-gray-400 hover:bg-emerald-950/40"
              }`}
            >
              <div className="font-bold text-white mb-1 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 text-teal-400" /> ThingSpeak
              </div>
              <div className="text-[10px] text-teal-400/70">
                Live IoT Cloud Feeds
              </div>
            </button>

            <button
              onClick={() => setDataSourceMode("firebase")}
              className={`p-3 rounded-xl border text-xs font-mono font-bold text-left transition-all ${
                dataSourceMode === "firebase"
                  ? "bg-emerald-950 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20"
                  : "glass-card border-emerald-900 text-gray-400 hover:bg-emerald-950/40"
              }`}
            >
              <div className="font-bold text-white mb-1">Firebase</div>
              <div className="text-[10px] text-emerald-400/70">
                Firestore Realtime
              </div>
            </button>
          </div>
        </div>

        {/* ThingSpeak Input Parameters */}
        {dataSourceMode === "thingspeak" && (
          <div className="space-y-4 p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30">
            <span className="text-xs font-mono font-bold text-teal-300 block uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-teal-400" /> ThingSpeak Cloud Telemetry API
            </span>

            <div>
              <label className="text-[11px] font-mono text-teal-400/80 block mb-1">
                ThingSpeak Channel ID
              </label>
              <input
                type="text"
                value={tsChannel}
                onChange={(e) => setTsChannel(e.target.value)}
                placeholder="e.g. 2548910"
                className="w-full px-3 py-2 rounded-xl glass-card text-xs font-mono text-teal-200 border border-teal-500/40 focus:outline-none focus:border-teal-300"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-teal-400/80 block mb-1">
                Read API Key
              </label>
              <input
                type="text"
                value={tsReadKey}
                onChange={(e) => setTsReadKey(e.target.value)}
                placeholder="e.g. X89AB23KLMN987"
                className="w-full px-3 py-2 rounded-xl glass-card text-xs font-mono text-teal-200 border border-teal-500/40 focus:outline-none focus:border-teal-300"
              />
            </div>
          </div>
        )}

        {/* Firebase Credentials Input */}
        {dataSourceMode === "firebase" && (
          <div className="space-y-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-xs font-mono font-bold text-emerald-300 block uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Firebase Parameters
            </span>

            <div>
              <label className="text-[11px] font-mono text-emerald-400/70 block mb-1">
                Firebase Project ID
              </label>
              <input
                type="text"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="forestguard-iot"
                className="w-full px-3 py-2 rounded-xl glass-card text-xs font-mono text-emerald-200 border border-emerald-500/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-emerald-400/70 block mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-xl glass-card text-xs font-mono text-emerald-200 border border-emerald-500/30 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 border-t border-emerald-900/50 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/30"
          >
            {saved ? <Check className="w-4 h-4 text-black" /> : null}
            <span>{saved ? "Settings Saved & Connected!" : "Save & Connect Telemetry"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
