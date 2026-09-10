import { MaintenanceMode } from "@/components/MaintenanceMode";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ForestGuard - System Upgrade In Progress",
  description: "ForestGuard is currently on hold during scheduled system maintenance and infrastructure upgrades.",
};

export default function HomePage() {
  return <MaintenanceMode />;
}
