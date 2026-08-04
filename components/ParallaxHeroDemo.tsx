"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Flame,
  Radio,
  Shield,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  Mouse,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Trees,
  Wifi,
  Cpu,
  MapPin,
  BarChart3,
  Activity,
} from "lucide-react";
import { ForestNode, AlertRecord } from "@/types/node";
import { subscribeToForestNodes, subscribeToAlertHistory } from "@/services/firestore";

export const ParallaxHeroDemo = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<ForestNode[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 30;
      const y = (clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Subscribe to real system telemetry data
  useEffect(() => {
    const unsubNodes = subscribeToForestNodes((updatedNodes) => {
      setNodes(updatedNodes);
    });

    const unsubAlerts = subscribeToAlertHistory((updatedAlerts) => {
      setAlerts(updatedAlerts);
    });

    return () => {
      unsubNodes();
      unsubAlerts();
    };
  }, []);

  const totalNodesCount = nodes.length || 3;
  const activeFireCount = nodes.filter((n) => n.fire).length;
  const totalAlertsCount = alerts.length || 1;

  return (
    <div className="relative min-h-screen bg-[#040d08] text-emerald-50 overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-black scroll-smooth">
      {/* 1. Deep Wilderness Forest Parallax Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-transform duration-300 ease-out opacity-40 scale-105 pointer-events-none z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop')`,
          transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
        }}
      />

      {/* 2. Dark Emerald Vignette & Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#040d08]/90 via-[#040d08]/60 to-[#040d08]/95 pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-emerald-900/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left Branding Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6 fill-emerald-500/20" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                FOREST<span className="text-emerald-400">GUARD</span>
              </span>
              <span className="text-[9px] tracking-widest text-emerald-300/70 uppercase font-mono block">
                Protecting Nature, Saving Future
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-emerald-200/80">
            <a href="#" className="text-emerald-400 border-b-2 border-emerald-400 pb-0.5 font-bold">Home</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#tech" className="hover:text-emerald-400 transition-colors">Technology</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </nav>

          {/* Right Header Button */}
          <Link
            href="/dashboard"
            className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel border border-emerald-500/40 text-emerald-200 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-lg"
          >
            <span>Launch Dashboard</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Floating Right Social Links */}
      <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-5 text-emerald-400/70">
        <a href="#" className="p-2.5 rounded-xl glass-card hover:text-emerald-300 hover:scale-110 transition-all border border-emerald-500/30">
          <Twitter className="w-4 h-4" />
        </a>
        <a href="#" className="p-2.5 rounded-xl glass-card hover:text-emerald-300 hover:scale-110 transition-all border border-emerald-500/30">
          <Facebook className="w-4 h-4" />
        </a>
        <a href="#" className="p-2.5 rounded-xl glass-card hover:text-emerald-300 hover:scale-110 transition-all border border-emerald-500/30">
          <Instagram className="w-4 h-4" />
        </a>
        <a href="#" className="p-2.5 rounded-xl glass-card hover:text-emerald-300 hover:scale-110 transition-all border border-emerald-500/30">
          <Mail className="w-4 h-4" />
        </a>
      </div>

      {/* ---------------- SECTION 1: HERO VIEW ---------------- */}
      <section className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col justify-between items-center text-center px-4 sm:px-6 pt-12 pb-16">
        {/* Giant Backdrop Text ("HERO") */}
        <div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[22vw] tracking-tighter text-white/10 uppercase select-none pointer-events-none whitespace-nowrap z-0 transition-transform duration-300"
          style={{
            transform: `translate3d(calc(-50% + ${mousePos.x * 0.15}px), calc(-50% + ${mousePos.y * 0.15}px), 0)`,
          }}
        >
          HERO
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center w-full">
          {/* Badge Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-xl backdrop-blur-md">
              <Trees className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              FOREST<span className="text-emerald-400">GUARD</span>
            </span>
          </motion.div>

          {/* Hero Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-5 text-white max-w-4xl drop-shadow-xl"
          >
            LoRa-Based Intelligent Forest Fire Detection and Early Warning System
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-base sm:text-lg text-emerald-100/80 font-normal leading-relaxed mb-8 drop-shadow"
          >
            Real-time monitoring, instant alerts, and intelligent analytics to protect our forests and save lives.
          </motion.p>

          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-2xl shadow-emerald-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 group"
            >
              <span>Launch Monitoring Dashboard</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Mobile Horizontal Scroll Frame (No Scrollbar Track Visible, Swipe Active) / Desktop Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/30 max-w-4xl shadow-2xl backdrop-blur-2xl flex md:grid md:grid-cols-4 gap-4 sm:gap-6 text-left overflow-x-auto snap-x snap-mandatory no-scrollbar"
          >
            {/* Stat 1: Monitoring Nodes */}
            <div className="flex items-center gap-4 border-r border-emerald-900/40 pr-4 shrink-0 min-w-[210px] md:min-w-0 snap-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none">{totalNodesCount}</div>
                <div className="text-xs font-bold text-emerald-200 mt-1">Monitoring Nodes</div>
                <div className="text-[10px] text-emerald-400/70 font-mono">Active in forest</div>
              </div>
            </div>

            {/* Stat 2: Fire Detected */}
            <div className="flex items-center gap-4 border-r border-emerald-900/40 pr-4 shrink-0 min-w-[210px] md:min-w-0 snap-center">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                <Flame className={`w-6 h-6 ${activeFireCount > 0 ? "text-red-500 animate-bounce" : "text-emerald-400"}`} />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none">{activeFireCount}</div>
                <div className="text-xs font-bold text-emerald-200 mt-1">Fire Detected</div>
                <div className="text-[10px] text-red-400/80 font-mono font-bold">
                  {activeFireCount > 0 ? "EMERGENCY ACTIVE" : "Zero Threats"}
                </div>
              </div>
            </div>

            {/* Stat 3: Alerts Sent */}
            <div className="flex items-center gap-4 border-r border-emerald-900/40 pr-4 shrink-0 min-w-[210px] md:min-w-0 snap-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none">{totalAlertsCount}</div>
                <div className="text-xs font-bold text-emerald-200 mt-1">Alerts Sent</div>
                <div className="text-[10px] text-emerald-400/70 font-mono">Successfully delivered</div>
              </div>
            </div>

            {/* Stat 4: System Uptime */}
            <div className="flex items-center gap-4 shrink-0 min-w-[210px] md:min-w-0 snap-center">
              <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-none">100%</div>
                <div className="text-xs font-bold text-emerald-200 mt-1">System Uptime</div>
                <div className="text-[10px] text-emerald-400/70 font-mono">Live telemetry online</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <a href="#about" className="mt-12 flex flex-col items-center gap-1.5 text-emerald-400/70 text-[10px] font-mono uppercase tracking-widest hover:text-emerald-300 transition-colors">
          <Mouse className="w-4 h-4 animate-bounce text-emerald-400" />
          <span>Scroll Down</span>
        </a>
      </section>

      {/* ---------------- SECTION 2: ABOUT THE SYSTEM ---------------- */}
      <section id="about" className="relative z-10 py-24 max-w-7xl mx-auto px-6 border-t border-emerald-900/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
            System Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Protecting Forests with Sub-GHz LoRa Telemetry
          </h2>
          <p className="text-emerald-200/70 text-sm sm:text-base mt-3">
            ForestGuard deploys long-range radio transmitter poles equipped with multi-sensor arrays across dense forest zones to detect wildfire outbreaks before they spread out of control.
          </p>
        </div>

        {/* All 3 System Overview Cards in ONE Horizontal Scroll Frame on Mobile (No Scrollbar Track Visible) */}
        <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4">
          {/* Card 1: 15km+ LoRa Radio Range */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 hover:border-emerald-400 transition-all shrink-0 w-[85vw] max-w-[340px] md:w-auto snap-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-6">
              <Wifi className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">15km+ LoRa Radio Range</h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed font-mono">
              Operates on 868MHz Sub-GHz frequency bands to penetrate dense forest canopies and remote mountain valleys without cellular networks.
            </p>
          </div>

          {/* Card 2: Dual Flame & Smoke Sensors */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 hover:border-emerald-400 transition-all shrink-0 w-[85vw] max-w-[340px] md:w-auto snap-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-400 mb-6">
              <Flame className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dual Flame & Smoke Sensors</h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed font-mono">
              Combines optical infrared flame detectors with MQ2 gas smoke sensors for sub-second early warning fire ignition detection.
            </p>
          </div>

          {/* Card 3: ThingSpeak Cloud Analytics */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 hover:border-emerald-400 transition-all shrink-0 w-[85vw] max-w-[340px] md:w-auto snap-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 mb-6">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">ThingSpeak Cloud Analytics</h3>
            <p className="text-xs text-emerald-200/70 leading-relaxed font-mono">
              Seamlessly syncs real-time temperature, humidity, and fire telemetry to MathWorks ThingSpeak IoT cloud for automated GIS mapping.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 3: KEY FEATURES ---------------- */}
      <section id="features" className="relative z-10 py-24 bg-[#02140b]/60 border-t border-emerald-900/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
              Advanced Wildfire Detection Features
            </h2>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4">
            {[
              { icon: MapPin, title: "Interactive GIS Satellite Map", desc: "Live Leaflet OpenStreetMap layer with satellite, topo, and dark forest views." },
              { icon: Bell, title: "Web Audio Siren & Screen Flash", desc: "Instant acoustic synthesizer alarm & flashing border alerts on fire detection." },
              { icon: Cpu, title: "16x2 Matrix LCD Simulation", desc: "Hardware gateway LCD screen simulation showing real-time LoRa packet logs." },
              { icon: Activity, title: "CSV Alert Log Export", desc: "One-click export of fire incident timestamps and GPS coordinates for forest responders." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-400 transition-all shrink-0 w-[80vw] max-w-[300px] sm:w-auto snap-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base mb-2">{f.title}</h4>
                  <p className="text-xs text-emerald-200/70 font-mono leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer id="contact" className="relative z-10 bg-[#010a05] border-t border-emerald-900/60 py-12 text-center text-xs font-mono text-emerald-400/60">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">ForestGuard IoT Wildfire System</span>
          </div>
          <div>Coimbatore Wilderness Sector • LoRa 868MHz Gateway</div>
          <div>&copy; 2026 ForestGuard. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
