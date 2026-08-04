import { ForestNode, AlertRecord, ReceiverKitStatus } from "@/types/node";

const INITIAL_NODES: ForestNode[] = [
  {
    nodeId: "01",
    status: "healthy",
    fire: false,
    smoke: false,
    temperature: undefined, // Real values fetched from ThingSpeak
    humidity: undefined,    // Real values fetched from ThingSpeak
    latitude: 11.550311,
    longitude: 77.338556,
    battery: 89,
    lastUpdated: new Date().toLocaleTimeString(),
    signalStrength: -78,
  },
  {
    nodeId: "02",
    status: "healthy",
    fire: false,
    smoke: false,
    temperature: 29.4,
    humidity: 62.5,
    latitude: 11.568423,
    longitude: 77.327464,
    battery: 94,
    lastUpdated: new Date().toLocaleTimeString(),
    signalStrength: -72,
  },
  {
    nodeId: "03",
    status: "healthy",
    fire: false,
    smoke: false,
    temperature: 31.2,
    humidity: 58.0,
    latitude: 11.588763,
    longitude: 77.341685,
    battery: 76,
    lastUpdated: new Date().toLocaleTimeString(),
    signalStrength: -85,
  },
];

const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: "ALT-1092",
    date: "2026-08-03",
    time: "14:22:10",
    nodeId: "02",
    latitude: 11.568423,
    longitude: 77.327464,
    resolved: true,
    priority: "High",
    smokeDetected: true,
  },
];

class RealtimeStore {
  private nodes: ForestNode[] = INITIAL_NODES;
  private alerts: AlertRecord[] = INITIAL_ALERTS;
  private receiver: ReceiverKitStatus = {
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
  };

  private nodeListeners: Set<(nodes: ForestNode[]) => void> = new Set();
  private alertListeners: Set<(alerts: AlertRecord[]) => void> = new Set();
  private receiverListeners: Set<(rx: ReceiverKitStatus) => void> = new Set();
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.startTelemetrySimulation();
    }
  }

  private startTelemetrySimulation() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.receiver.packetsReceived += 1;
      
      // Simulate demo values only for Pole 02 and Pole 03
      this.nodes = this.nodes.map((n) => {
        if (n.nodeId === "02") {
          return {
            ...n,
            temperature: 29.0 + (Math.sin(Date.now() / 5000) * 1.5),
            humidity: 62.0 + (Math.cos(Date.now() / 5000) * 2.0),
            lastUpdated: new Date().toLocaleTimeString(),
          };
        }
        if (n.nodeId === "03") {
          return {
            ...n,
            temperature: 31.0 + (Math.cos(Date.now() / 6000) * 1.2),
            humidity: 58.0 + (Math.sin(Date.now() / 6000) * 1.8),
            lastUpdated: new Date().toLocaleTimeString(),
          };
        }
        return n;
      });

      this.notifyNodes();
      this.notifyReceiver();
    }, 3000);
  }

  public getNodes(): ForestNode[] {
    return this.nodes;
  }

  public getAlerts(): AlertRecord[] {
    return this.alerts;
  }

  public getReceiverStatus(): ReceiverKitStatus {
    return this.receiver;
  }

  public subscribeNodes(callback: (nodes: ForestNode[]) => void): () => void {
    this.nodeListeners.add(callback);
    callback(this.nodes);
    return () => this.nodeListeners.delete(callback);
  }

  public subscribeAlerts(callback: (alerts: AlertRecord[]) => void): () => void {
    this.alertListeners.add(callback);
    callback(this.alerts);
    return () => this.alertListeners.delete(callback);
  }

  public subscribeReceiver(callback: (rx: ReceiverKitStatus) => void): () => void {
    this.receiverListeners.add(callback);
    callback(this.receiver);
    return () => this.receiverListeners.delete(callback);
  }

  public setFireState(nodeId: string, fireState: boolean) {
    const targetNode = this.nodes.find((n) => n.nodeId === nodeId);
    if (!targetNode) return;

    const updatedStatus = fireState ? "fire" : "healthy";

    this.nodes = this.nodes.map((n) =>
      n.nodeId === nodeId
        ? {
            ...n,
            fire: fireState,
            smoke: fireState,
            status: updatedStatus,
            lastUpdated: new Date().toLocaleTimeString(),
          }
        : n
    );

    const anyFire = this.nodes.some((n) => n.fire);
    this.receiver.buzzer = anyFire;
    this.receiver.ledRed = anyFire;
    this.receiver.ledGreen = !anyFire;
    if (fireState) {
      this.receiver.currentNodeId = nodeId;
      this.receiver.currentLat = targetNode.latitude;
      this.receiver.currentLng = targetNode.longitude;
    }

    if (fireState) {
      const now = new Date();
      const newAlert: AlertRecord = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString(),
        nodeId: nodeId,
        latitude: targetNode.latitude,
        longitude: targetNode.longitude,
        resolved: false,
        priority: "Critical",
        smokeDetected: true,
      };
      this.alerts = [newAlert, ...this.alerts];
      this.notifyAlerts();
    }

    this.notifyNodes();
    this.notifyReceiver();
  }

  public resolveAlert(alertId: string) {
    this.alerts = this.alerts.map((a) => (a.id === alertId ? { ...a, resolved: true } : a));
    this.notifyAlerts();
  }

  private notifyNodes() {
    this.nodeListeners.forEach((cb) => cb([...this.nodes]));
  }

  private notifyAlerts() {
    this.alertListeners.forEach((cb) => cb([...this.alerts]));
  }

  private notifyReceiver() {
    this.receiverListeners.forEach((cb) => cb({ ...this.receiver }));
  }
}

export const realtimeStore = new RealtimeStore();
