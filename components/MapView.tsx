"use client";

import dynamic from "next/dynamic";
import React from "react";
import { ForestNode } from "@/types/node";

const MapInnerDynamic = dynamic(
  () => import("./MapInner").then((mod) => mod.MapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-2xl glass-panel border border-emerald-500/30 flex flex-col items-center justify-center gap-3 text-emerald-400 font-mono text-sm">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading React Leaflet OpenStreetMap GIS Canvas...</span>
      </div>
    ),
  }
);

interface MapViewProps {
  nodes: ForestNode[];
  onTriggerFire?: (nodeId: string) => void;
}

export const MapView: React.FC<MapViewProps> = (props) => {
  return <MapInnerDynamic {...props} />;
};
