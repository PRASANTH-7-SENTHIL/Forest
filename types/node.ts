export type NodeStatus = "healthy" | "fire" | "warning" | "offline";

export interface ForestNode {
  nodeId: string;
  status: NodeStatus;
  fire: boolean;
  smoke: boolean;
  temperature?: number;
  humidity?: number;
  latitude: number;
  longitude: number;
  battery: number;
  lastUpdated: string;
  signalStrength: number;
}

export interface AlertRecord {
  id: string;
  date: string;
  time: string;
  nodeId: string;
  latitude: number;
  longitude: number;
  resolved: boolean;
  priority: "High" | "Critical" | "Warning";
  smokeDetected?: boolean;
}

export interface ReceiverKitStatus {
  status: "Connected" | "Disconnected" | "Syncing";
  signalStrength: number;
  packetsReceived: number;
  currentNodeId: string;
  currentLat: number;
  currentLng: number;
  currentTemp?: number;
  currentHumidity?: number;
  buzzer: boolean;
  ledRed: boolean;
  ledGreen: boolean;
}

export interface ThingSpeakConfig {
  channelId: string;
  readApiKey: string;
  enabled: boolean;
  pollIntervalSec: number;
}
