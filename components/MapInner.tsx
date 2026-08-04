"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { ForestNode } from "@/types/node";
import { createHealthyIcon, createFireIcon, createWarningIcon } from "@/lib/leaflet";
import { Maximize2, Minimize2, Satellite, Map as MapIcon, Mountain, Moon } from "lucide-react";

interface MapInnerProps {
  nodes: ForestNode[];
  onTriggerFire?: (nodeId: string) => void;
}

type MapLayerType = "satellite" | "standard" | "topo" | "dark";

const TILE_LAYERS: Record<MapLayerType, { url: string; attribution: string; name: string }> = {
  satellite: {
    name: "Satellite View",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  standard: {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  topo: {
    name: "Terrain Topo",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
  dark: {
    name: "Dark Forest",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
};

export const MapInner: React.FC<MapInnerProps> = ({ nodes, onTriggerFire }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayerType>("satellite");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const centerLat = 11.568423;
  const centerLng = 77.338556;

  // Initialize Map with chosen Tile Layer
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if ((mapContainerRef.current as unknown as { _leaflet_id: number | null })._leaflet_id) {
      (mapContainerRef.current as unknown as { _leaflet_id: number | null })._leaflet_id = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      scrollWheelZoom: true,
    });

    const activeConfig = TILE_LAYERS[currentLayer];
    const initialTileLayer = L.tileLayer(activeConfig.url, {
      attribution: activeConfig.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = initialTileLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Layer Switch
  const handleLayerSwitch = (layerKey: MapLayerType) => {
    setCurrentLayer(layerKey);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = TILE_LAYERS[layerKey];
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  };

  // Update Markers & Popups dynamically when nodes state updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    let fireNode: ForestNode | null = null;

    nodes.forEach((node) => {
      let icon = createHealthyIcon();
      if (node.fire) {
        icon = createFireIcon();
        fireNode = node;
      } else if (node.status === "warning" || node.smoke) {
        icon = createWarningIcon();
      }

      const marker = L.marker([node.latitude, node.longitude], { icon }).addTo(map);

      const popupHtml = `
        <div class="p-2 space-y-2 text-xs font-mono min-w-[210px]">
          <div class="flex items-center justify-between border-b border-emerald-800/40 pb-1">
            <span class="font-bold text-white text-sm">Pole #${node.nodeId}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              node.fire ? "bg-red-950 text-red-400 border border-red-500" : "bg-emerald-950 text-emerald-400"
            }">${node.status.toUpperCase()}</span>
          </div>

          <div class="space-y-1 text-emerald-200">
            <div class="flex justify-between">
              <span class="text-emerald-400/80">Field 1 (Flame):</span>
              <span class="font-bold ${node.fire ? "text-red-400" : "text-emerald-300"}">${node.fire ? "FIRE (1)" : "CLEAR (0)"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-emerald-400/80">Field 2 (MQ2):</span>
              <span class="font-bold ${node.smoke ? "text-amber-400" : "text-emerald-300"}">${node.smoke ? "SMOKE (1)" : "CLEAR (0)"}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-emerald-400/80">Field 3 (Temp):</span>
              <span class="font-bold text-teal-300">${node.temperature ?? 28.5}°C</span>
            </div>
            <div class="flex justify-between">
              <span class="text-emerald-400/80">Field 4 (Humidity):</span>
              <span class="font-bold text-sky-300">${node.humidity ?? 65}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-emerald-400/80">Coordinates:</span>
              <span class="font-bold">${node.latitude.toFixed(6)}, ${node.longitude.toFixed(6)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-emerald-400/80">Battery / RSSI:</span>
              <span class="font-bold text-emerald-300">${node.battery}% | ${node.signalStrength} dBm</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersRef.current[node.nodeId] = marker;

      if (node.fire) {
        marker.openPopup();
      }
    });

    if (fireNode) {
      map.flyTo([fireNode.latitude, fireNode.longitude], 16, { duration: 1.5 });
    }
  }, [nodes]);

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full h-[540px] rounded-2xl overflow-hidden glass-panel border border-emerald-500/30">
      {/* Top Map Layer Selector Control Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2">
        <div className="glass-card px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline font-bold">Map Layer:</span>
        </div>

        {/* Satellite Button */}
        <button
          onClick={() => handleLayerSwitch("satellite")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
            currentLayer === "satellite"
              ? "bg-emerald-500 text-black shadow-emerald-500/30"
              : "glass-card text-emerald-200 hover:bg-emerald-950 border border-emerald-500/30"
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>

        {/* OpenStreetMap Button */}
        <button
          onClick={() => handleLayerSwitch("standard")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
            currentLayer === "standard"
              ? "bg-emerald-500 text-black shadow-emerald-500/30"
              : "glass-card text-emerald-200 hover:bg-emerald-950 border border-emerald-500/30"
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>OpenStreetMap</span>
        </button>

        {/* Terrain Topo Button */}
        <button
          onClick={() => handleLayerSwitch("topo")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
            currentLayer === "topo"
              ? "bg-emerald-500 text-black shadow-emerald-500/30"
              : "glass-card text-emerald-200 hover:bg-emerald-950 border border-emerald-500/30"
          }`}
        >
          <Mountain className="w-3.5 h-3.5" />
          <span>Terrain Topo</span>
        </button>

        {/* Dark Forest Button */}
        <button
          onClick={() => handleLayerSwitch("dark")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
            currentLayer === "dark"
              ? "bg-emerald-500 text-black shadow-emerald-500/30"
              : "glass-card text-emerald-200 hover:bg-emerald-950 border border-emerald-500/30"
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark Forest</span>
        </button>
      </div>

      {/* Map Action Controls Overlay (Fullscreen) */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="glass-card p-2.5 rounded-xl text-emerald-300 hover:bg-emerald-950 border border-emerald-500/30 shadow-lg"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] glass-panel px-4 py-3 rounded-xl border border-emerald-500/30 text-xs font-mono space-y-1.5 shadow-xl">
        <div className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-wider mb-1">
          Map Legend ({TILE_LAYERS[currentLayer].name})
        </div>
        <div className="flex items-center gap-2 text-emerald-200">
          <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400" />
          <span>Green = Healthy Pole</span>
        </div>
        <div className="flex items-center gap-2 text-red-300">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse shadow-sm shadow-red-500" />
          <span>Red = Fire Detected</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          <span>Yellow = Warning / Smoke</span>
        </div>
      </div>

      {/* Pure HTML Div for Leaflet Instance */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
