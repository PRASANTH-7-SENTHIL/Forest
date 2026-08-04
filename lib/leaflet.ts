import L from "leaflet";

export const createHealthyIcon = () => {
  return L.divIcon({
    className: "leaflet-marker-clean",
    html: `<div class="relative flex items-center justify-center w-8 h-8">
             <div class="w-7 h-7 bg-emerald-500 border-2 border-emerald-950 rounded-full shadow-lg flex items-center justify-center text-xs font-bold text-black z-10 shadow-emerald-500/80 hover:scale-110 transition-transform">📍</div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const createFireIcon = () => {
  return L.divIcon({
    className: "leaflet-marker-clean",
    html: `<div class="relative flex items-center justify-center w-14 h-14">
             <span class="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-red-600 opacity-90"></span>
             <span class="animate-pulse absolute inline-flex h-10 w-10 rounded-full bg-amber-500 opacity-80"></span>
             <div class="w-9 h-9 bg-red-600 border-2 border-white rounded-full shadow-2xl flex items-center justify-center text-base z-10 animate-bounce shadow-red-600/80">🔥</div>
           </div>`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
    popupAnchor: [0, -28],
  });
};

export const createWarningIcon = () => {
  return L.divIcon({
    className: "leaflet-marker-clean",
    html: `<div class="relative flex items-center justify-center w-8 h-8">
             <div class="w-7 h-7 bg-amber-500 border-2 border-black rounded-full shadow-lg flex items-center justify-center text-xs text-black font-bold z-10">⚠️</div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};
