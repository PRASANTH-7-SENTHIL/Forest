import { ForestNode, ThingSpeakConfig } from "@/types/node";

export async function fetchThingSpeakFeed(config: ThingSpeakConfig): Promise<Partial<ForestNode> | null> {
  const channelId = config.channelId || process.env.NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID || "3443686";
  const readKey = config.readApiKey || process.env.NEXT_PUBLIC_THINGSPEAK_READ_API_KEY || "ABGXJ62NFB3DIHA3";

  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds/last.json?api_key=${readKey}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.warn("ThingSpeak HTTP Error:", response.status);
      return null;
    }

    const data = await response.json();
    if (!data || data === -1) return null;

    // Check if fields are actually present in the latest feed (Real Values)
    const hasField1 = data.field1 !== null && data.field1 !== undefined && data.field1 !== "";
    const hasField2 = data.field2 !== null && data.field2 !== undefined && data.field2 !== "";
    const hasField3 = data.field3 !== null && data.field3 !== undefined && data.field3 !== "";
    const hasField4 = data.field4 !== null && data.field4 !== undefined && data.field4 !== "";

    // Field 1 = Flame sensor reading (Pole 01)
    const flameRaw = data.field1;
    const isFlameDetected =
      hasField1 &&
      (flameRaw === "1" ||
        flameRaw === 1 ||
        String(flameRaw).toLowerCase() === "true" ||
        Number(flameRaw) > 100 ||
        Number(flameRaw) === 1);

    // Field 2 = MQ2 Smoke sensor reading (Pole 01)
    const mq2Raw = data.field2;
    const isSmokeDetected =
      hasField2 &&
      (mq2Raw === "1" ||
        mq2Raw === 1 ||
        String(mq2Raw).toLowerCase() === "true" ||
        Number(mq2Raw) > 100 ||
        Number(mq2Raw) === 1);

    // Field 3 = Temperature (°C)
    const tempVal = hasField3 ? parseFloat(data.field3) : undefined;

    // Field 4 = Humidity (%)
    const humidityVal = hasField4 ? parseFloat(data.field4) : undefined;

    const timeStr = data.created_at
      ? new Date(data.created_at).toLocaleTimeString()
      : "Waiting for upload";

    return {
      nodeId: "01", // Real values for Pole 01 from ThingSpeak Channel
      fire: isFlameDetected,
      smoke: isSmokeDetected,
      temperature: tempVal,
      humidity: humidityVal,
      status: isFlameDetected ? "fire" : isSmokeDetected ? "warning" : "healthy",
      lastUpdated: timeStr,
    };
  } catch (error) {
    console.warn("Error fetching ThingSpeak telemetry:", error);
    return null;
  }
}
