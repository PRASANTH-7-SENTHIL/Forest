import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForestGuard - LoRa-Based Intelligent Forest Fire Detection System",
  description:
    "Real-time IoT wilderness fire detection app utilizing LoRa telemetry, OpenStreetMap React Leaflet GIS, and Firebase Firestore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060907] text-[#ecfdf5] antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
