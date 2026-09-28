import { ParallaxHeroDemo } from "@/components/ParallaxHeroDemo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForestGuard - LoRa-Based Intelligent Forest Fire Detection & Early Warning System",
  description:
    "Real-time IoT wilderness fire detection app utilizing LoRa telemetry, OpenStreetMap React Leaflet GIS, and ThingSpeak cloud integration.",
};

export default function HomePage() {
  return <ParallaxHeroDemo />;
}
