import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { ForestNode, AlertRecord, ReceiverKitStatus } from "@/types/node";
import { realtimeStore } from "./mockStore";

export function subscribeToForestNodes(
  onUpdate: (nodes: ForestNode[]) => void,
  useFirebase = false
): () => void {
  if (useFirebase && db) {
    try {
      const nodesCol = collection(db, "nodes");
      const unsubscribe = onSnapshot(
        nodesCol,
        (snapshot) => {
          const nodesList: ForestNode[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as ForestNode;
            nodesList.push({
              nodeId: data.nodeId || docSnap.id,
              status: data.status || (data.fire ? "fire" : "healthy"),
              fire: !!data.fire,
              smoke: !!data.smoke,
              latitude: data.latitude || 11.550311,
              longitude: data.longitude || 77.338556,
              battery: data.battery ?? 100,
              lastUpdated: data.lastUpdated || new Date().toLocaleTimeString(),
              signalStrength: data.signalStrength ?? -78,
            });
          });
          if (nodesList.length > 0) {
            onUpdate(nodesList);
            return;
          }
        },
        (error) => {
          console.warn("Firestore listener error, using realtime simulation fallback:", error);
        }
      );
      return unsubscribe;
    } catch (e) {
      console.warn("Firestore error:", e);
    }
  }

  return realtimeStore.subscribeNodes(onUpdate);
}

export function subscribeToAlertHistory(
  onUpdate: (alerts: AlertRecord[]) => void
): () => void {
  return realtimeStore.subscribeAlerts(onUpdate);
}

export function subscribeToReceiverKit(
  onUpdate: (rx: ReceiverKitStatus) => void
): () => void {
  return realtimeStore.subscribeReceiver(onUpdate);
}

export async function toggleNodeFireState(nodeId: string, isFire: boolean, useFirebase = false) {
  if (useFirebase && db) {
    try {
      const docRef = doc(db, "nodes", `node${nodeId}`);
      await updateDoc(docRef, {
        fire: isFire,
        smoke: isFire,
        status: isFire ? "fire" : "healthy",
        lastUpdated: new Date().toLocaleTimeString(),
      });
    } catch (e) {
      console.warn("Could not update Firestore document, fallback to local store:", e);
    }
  }
  realtimeStore.setFireState(nodeId, isFire);
}

export function resolveFireAlert(alertId: string) {
  realtimeStore.resolveAlert(alertId);
}
