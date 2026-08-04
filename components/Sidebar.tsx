"use client";

import React from "react";
import Link from "next/link";
import {
  TreePine,
  LayoutDashboard,
  Activity,
  MapPin,
  History,
  Radio,
  Settings,
  LogOut,
  X,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  hasFire: boolean;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  isOpen,
  setIsOpen,
  hasFire,
  onOpenSettings,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "monitoring", label: "Live Monitoring", icon: Activity, badge: hasFire ? "ALERT" : null },
    { id: "map", label: "Map View", icon: MapPin },
    { id: "alerts", label: "Alert History", icon: History },
    { id: "nodes", label: "Node Status", icon: Radio },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 glass-panel z-50 flex flex-col justify-between border-r border-emerald-900/40 transition-transform duration-300 ease-in-out overflow-y-auto shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div>
          {/* Header Branding */}
          <div className="p-6 flex items-center justify-between border-b border-emerald-900/40">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-300/30">
                <TreePine className="w-5 h-5 text-black" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white flex items-center gap-1">
                  Forest<span className="text-emerald-400">Guard</span>
                </span>
                <span className="text-[10px] tracking-widest text-emerald-400/80 uppercase font-mono block">
                  IoT Wildfire System
                </span>
              </div>
            </Link>
            <button
              className="lg:hidden p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/40 shadow-inner"
                      : "text-emerald-100/70 hover:bg-emerald-950/50 hover:text-emerald-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-transform group-hover:scale-110",
                        isActive ? "text-emerald-400" : "text-emerald-500/70"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-emerald-900/40 space-y-2">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-300/80 hover:bg-emerald-950 hover:text-emerald-300 transition-colors"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Settings</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
};
