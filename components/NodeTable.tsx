"use client";

import React, { useState } from "react";
import { ForestNode } from "@/types/node";
import { StatusBadge } from "./StatusBadge";
import { Search, Filter, Radio, Flame, CloudFog, Thermometer, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface NodeTableProps {
  nodes: ForestNode[];
  onToggleFire: (nodeId: string, currentFire: boolean) => void;
}

export const NodeTable: React.FC<NodeTableProps> = ({ nodes, onToggleFire }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFireOnly, setFilterFireOnly] = useState(false);

  const filteredNodes = nodes.filter((n) => {
    const matchesSearch = n.nodeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFire = filterFireOnly ? n.fire : true;
    return matchesSearch && matchesFire;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" /> Active IoT Pole Status & Sensor Telemetry
          </h3>
          <p className="text-xs font-mono text-emerald-400/70">
            ThingSpeak Live Channel 3443686: Field 1 (Flame), Field 2 (MQ2), Field 3 (Temp), Field 4 (Humidity)
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Pole ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl glass-card text-xs font-mono text-emerald-200 border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Filter Fire Only */}
          <button
            onClick={() => setFilterFireOnly(!filterFireOnly)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border",
              filterFireOnly
                ? "bg-red-950 text-red-400 border-red-500"
                : "glass-card text-emerald-300 border-emerald-500/30 hover:bg-emerald-950"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterFireOnly ? "Fire Nodes Only" : "All Poles"}</span>
          </button>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-emerald-900/60 text-emerald-400/80 uppercase tracking-wider">
              <th className="py-3 px-4">Pole ID</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Field 1: Flame</th>
              <th className="py-3 px-4">Field 2: MQ2 Smoke</th>
              <th className="py-3 px-4">Field 3: Temperature</th>
              <th className="py-3 px-4">Field 4: Humidity</th>
              <th className="py-3 px-4">Coordinates (Lat / Lng)</th>
              <th className="py-3 px-4">Battery</th>
              <th className="py-3 px-4">RSSI Signal</th>
              <th className="py-3 px-4 text-right">Simulation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/30 text-emerald-100">
            {filteredNodes.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-emerald-400/60 font-mono">
                  No matching transmitter poles found.
                </td>
              </tr>
            ) : (
              filteredNodes.map((node) => (
                <tr key={node.nodeId} className="hover:bg-emerald-950/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">Pole {node.nodeId}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={node.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    {node.fire ? (
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <Flame className="w-4 h-4 text-red-500 animate-bounce" /> DETECTED (1)
                      </span>
                    ) : (
                      <span className="text-emerald-400/60">CLEAR (0)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {node.smoke ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <CloudFog className="w-4 h-4 text-amber-400" /> SMOKE (1)
                      </span>
                    ) : (
                      <span className="text-emerald-400/60">NORMAL (0)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {node.temperature !== undefined ? (
                      <span className="text-teal-300 font-bold flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-teal-400" /> {node.temperature}°C
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">-- (Waiting for upload)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {node.humidity !== undefined ? (
                      <span className="text-sky-300 font-bold flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-400" /> {node.humidity}%
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">-- (Waiting for upload)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300">
                    {node.latitude.toFixed(6)}, {node.longitude.toFixed(6)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            node.battery > 50 ? "bg-emerald-400" : node.battery > 20 ? "bg-amber-400" : "bg-red-500"
                          )}
                          style={{ width: `${node.battery}%` }}
                        />
                      </div>
                      <span>{node.battery}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-300">{node.signalStrength} dBm</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onToggleFire(node.nodeId, node.fire)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold transition-all shadow",
                        node.fire
                          ? "bg-emerald-500 text-black hover:bg-emerald-400"
                          : "bg-red-600/90 hover:bg-red-500 text-white"
                      )}
                    >
                      {node.fire ? "Clear Fire" : "Trigger Fire"}
                    </button>
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
