"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { SummaryCards } from "@/components/SummaryCards";
import { LiveAlert } from "@/components/LiveAlert";
import { ReceiverPanel } from "@/components/ReceiverPanel";
import { MapView } from "@/components/MapView";
import { NodeTable } from "@/components/NodeTable";
import { AlertHistory } from "@/components/AlertHistory";
import { FireToast } from "@/components/FireToast";
import { SettingsModal } from "@/components/SettingsModal";
import { ForestNode, AlertRecord, ReceiverKitStatus, ThingSpeakConfig } from "@/types/node";
import {
  subscribeToForestNodes,
  subscribeToAlertHistory,
  subscribeToReceiverKit,
  toggleNodeFireState,
  resolveFireAlert,
} from "@/services/firestore";
import { fetchThingSpeakFeed } from "@/services/thingspeak";
import { alarmManager } from "@/lib/audio";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [nodes, setNodes] = useState<ForestNode[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [receiver, setReceiver] = useState<ReceiverKitStatus>({
    status: "Connected",
    signalStrength: -78,
    packetsReceived: 1420,
    currentNodeId: "01",
    currentLat: 11.550311,
    currentLng: 77.338556,
    currentTemp: undefined,
    currentHumidity: undefined,
    buzzer: false,
    ledRed: false,
    ledGreen: true,
  });

  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedPoleId, setSelectedPoleId] = useState<string>("01"); // Pole 01 = ThingSpeak Real, Pole 02/03 = Demo
  const [dataSourceMode, setDataSourceMode] = useState<"simulator" | "firebase" | "thingspeak">("thingspeak");
  
  const [thingSpeakConfig, setThingSpeakConfig] = useState<ThingSpeakConfig>({
    channelId: process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID || "3443686",
    readApiKey: process.env.NEXT_PUBLIC_THINGSPEAK_READ_API_KEY || "ABGXJ62NFB3DIHA3",
    enabled: true,
    pollIntervalSec: 3,
  });

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [dismissToast, setDismissToast] = useState<boolean>(false);

  // Subscriptions to Realtime Store / Firebase
  useEffect(() => {
    const unsubNodes = subscribeToForestNodes((updatedNodes) => {
      setNodes(updatedNodes);
    }, dataSourceMode === "firebase");

    const unsubAlerts = subscribeToAlertHistory((updatedAlerts) => {
      setAlerts(updatedAlerts);
    });

    const unsubRx = subscribeToReceiverKit((updatedRx) => {
      setReceiver((prev) => ({
        ...prev,
        ...updatedRx,
      }));
    });

    return () => {
      unsubNodes();
      unsubAlerts();
      unsubRx();
    };
  }, [dataSourceMode]);

  // ThingSpeak Live Data Effect ONLY for Pole 01 (Real Values from Channel read from .env)
  useEffect(() => {
    if (dataSourceMode !== "thingspeak") return;

    const pollThingSpeak = async () => {
      const tsData = await fetchThingSpeakFeed(thingSpeakConfig);
      if (tsData) {
        setNodes((prevNodes) =>
          prevNodes.map((n) =>
            n.nodeId === "01"
              ? {
                  ...n,
                  ...tsData,
                  battery: tsData.battery ?? n.battery,
                  signalStrength: tsData.signalStrength ?? n.signalStrength,
                }
              : n
          )
        );

        if (selectedPoleId === "01") {
          setReceiver((prev) => ({
            ...prev,
            currentNodeId: "01",
            currentLat: 11.550311,
            currentLng: 77.338556,
            currentTemp: tsData.temperature,
            currentHumidity: tsData.humidity,
            buzzer: !!tsData.fire,
            ledRed: !!tsData.fire,
            ledGreen: !tsData.fire,
          }));
        }
      }
    };

    pollThingSpeak();
    const interval = setInterval(pollThingSpeak, (thingSpeakConfig.pollIntervalSec || 3) * 1000);
    return () => clearInterval(interval);
  }, [dataSourceMode, thingSpeakConfig, selectedPoleId]);

  // Update Receiver Panel when Pole Selection Changes
  useEffect(() => {
    const activeNode = nodes.find((n) => n.nodeId === selectedPoleId);
    if (activeNode) {
      setReceiver((prev) => ({
        ...prev,
        currentNodeId: activeNode.nodeId,
        currentLat: activeNode.latitude,
        currentLng: activeNode.longitude,
        currentTemp: activeNode.temperature,
        currentHumidity: activeNode.humidity,
        buzzer: !!activeNode.fire,
        ledRed: !!activeNode.fire,
        ledGreen: !activeNode.fire,
      }));
    }
  }, [selectedPoleId, nodes]);

  // Audio Siren & Red Screen Flashing Effect when Fire Detected
  const fireNodes = nodes.filter((n) => n.fire);
  const hasFire = fireNodes.length > 0;

  useEffect(() => {
    if (hasFire) {
      setDismissToast(false);
      if (!isMuted) {
        alarmManager.playFireAlarm();
      }
    } else {
      alarmManager.stopAlarm();
    }
  }, [hasFire, isMuted]);

  // Quick Test Simulation Toggle (Fire Node 01)
  const handleSimulateGlobalFire = () => {
    if (hasFire) {
      nodes.forEach((n) => {
        if (n.fire) {
          toggleNodeFireState(n.nodeId, false, dataSourceMode === "firebase");
        }
      });
    } else {
      toggleNodeFireState("01", true, dataSourceMode === "firebase");
    }
  };

  const handleToggleNodeFire = (nodeId: string, currentFire: boolean) => {
    toggleNodeFireState(nodeId, !currentFire, dataSourceMode === "firebase");
  };

  const handleResolveAlertNode = (nodeId: string) => {
    toggleNodeFireState(nodeId, false, dataSourceMode === "firebase");
  };

  return (
    <div
      className={cn(
        "h-screen w-screen bg-darkBg text-emerald-50 flex overflow-hidden relative",
        hasFire && "fire-alert-border"
      )}
    >
      {/* Left Independent Scrolling Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        hasFire={hasFire}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Right Independent Scrolling Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Sticky Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          fireCount={fireNodes.length}
          onSimulateFire={handleSimulateGlobalFire}
          isMuted={isMuted}
          onToggleMute={() => {
            if (!isMuted) alarmManager.stopAlarm();
            setIsMuted(!isMuted);
          }}
          selectedPoleId={selectedPoleId}
          onSelectPole={(id) => setSelectedPoleId(id)}
        />

        {/* Body Dashboard Views */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full flex-1">
          {/* Top Summary Cards */}
          <SummaryCards nodes={nodes} />

          {/* Live Critical Fire Emergency Banner */}
          <LiveAlert fireNodes={fireNodes} onResolve={handleResolveAlertNode} />

          {/* Main Interactive Views based on Active Sidebar Tab */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              {/* Map & Hardware Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MapView nodes={nodes} onTriggerFire={(id) => handleToggleNodeFire(id, nodes.find((n) => n.nodeId === id)?.fire || false)} />
                </div>
                <div>
                  <ReceiverPanel receiver={receiver} />
                </div>
              </div>

              {/* Node Status Table */}
              <NodeTable nodes={nodes} onToggleFire={handleToggleNodeFire} />

              {/* Alert Log Table */}
              <AlertHistory alerts={alerts} onResolveAlert={resolveFireAlert} />
            </div>
          )}

          {activeSection === "monitoring" && (
            <div className="space-y-6">
              <ReceiverPanel receiver={receiver} />
              <MapView nodes={nodes} onTriggerFire={(id) => handleToggleNodeFire(id, nodes.find((n) => n.nodeId === id)?.fire || false)} />
            </div>
          )}

          {activeSection === "map" && (
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <h2 className="font-bold text-white text-lg">Full GIS OpenStreetMap Layer</h2>
                <span className="text-xs font-mono text-emerald-400">Coimbatore Wilderness Sector</span>
              </div>
              <MapView nodes={nodes} onTriggerFire={(id) => handleToggleNodeFire(id, nodes.find((n) => n.nodeId === id)?.fire || false)} />
            </div>
          )}

          {activeSection === "alerts" && (
            <AlertHistory alerts={alerts} onResolveAlert={resolveFireAlert} />
          )}

          {activeSection === "nodes" && (
            <NodeTable nodes={nodes} onToggleFire={handleToggleNodeFire} />
          )}
        </main>
      </div>

      {/* Floating Emergency Toast Notification */}
      {!dismissToast && (
        <FireToast fireNodes={fireNodes} onDismiss={() => setDismissToast(true)} />
      )}

      {/* System Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        dataSourceMode={dataSourceMode}
        setDataSourceMode={setDataSourceMode}
        thingSpeakConfig={thingSpeakConfig}
        setThingSpeakConfig={setThingSpeakConfig}
      />
    </div>
  );
}
