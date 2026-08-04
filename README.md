# ForestGuard: LoRa-Based Intelligent Forest Fire Detection and Early Warning System

![ForestGuard Banner](https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop)

ForestGuard is a state-of-the-art web application and IoT wildfire telemetry system designed to provide real-time forest fire detection, early warning alerts, GIS satellite mapping, and environmental sensor analytics.

---

## 🌟 Key Features

- **21st.dev Parallax Wilderness Landing Page**: Interactive mouse-tracking parallax backdrop with giant 3D typography (`HERO`), stats cards, system capabilities, and smooth scroll navigation.
- **Real-Time GIS Satellite Mapping**: Dynamic Leaflet map layer with 4 toggleable tile views:
  - 🛰️ **Satellite View** (Esri World Imagery)
  - 🗺️ **OpenStreetMap** (Standard GIS layout)
  - 🏔️ **Terrain Topo** (OpenTopoMap elevation contours)
  - 🌙 **Dark Forest** (CartoDB Dark Matter theme)
- **ThingSpeak IoT Cloud Integration**: Directly polls telemetry feeds from MathWorks ThingSpeak (Channel ID: `3443686`, Key: `ABGXJ62NFB3DIHA3`):
  - **Field 1**: Flame Sensor (Fire Detection Trigger)
  - **Field 2**: MQ2 Smoke Sensor (Smoke Warning Detector)
  - **Field 3**: Temperature Sensor (°C)
  - **Field 4**: Humidity Sensor (%)
- **Top-Right Pole Telemetry Selector**:
  - `Pole 1`: Real-time live feeds from ThingSpeak Channel `3443686`.
  - `Pole 2`: Simulated climate monitoring pole (`11.568423, 77.327464`).
  - `Pole 3`: Simulated wilderness pole (`11.588763, 77.341685`).
- **Pulsating Fire Alert Map Markers**: Only fire-detected poles blink with an expanding red radar ring, glowing amber pulse, and bouncing flame icon (`🔥`).
- **Web Audio Siren & Flashing Border**: Instant acoustic synthesizer alarm and red screen flash when a fire threat is detected.
- **Physical Gateway 16x2 LCD Matrix Simulator**: Displays real-time LoRa gateway packets, RSSI signal, LED status lights, and buzzer alarms.
- **CSV Incident Report Export**: One-click download of fire event logs and GPS coordinates for forest responders.
- **Dual Independent Scrollbars Layout**: Independent vertical scrollbars for the left navigation menu and right main dashboard view.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Glassmorphism & Custom Keyframe Animations
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Mapping**: Leaflet + Esri / OpenStreetMap / OpenTopoMap Tiling
- **IoT Cloud**: MathWorks ThingSpeak REST API
- **State Store**: Real-time Event Emitter & Firebase Firestore Ready

---

## 🛠️ Environment Setup

Create a `.env.local` file in the root directory with your ThingSpeak channel credentials:

```env
NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID=3443686
NEXT_PUBLIC_THINGSPEAK_READ_API_KEY=ABGXJ62NFB3DIHA3
```

---

## 📦 Installation & Local Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PRASANTH-7-SENTHIL/Forest.git
   cd Forest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - **Landing Page**: `http://localhost:3000`
   - **IoT Monitoring Dashboard**: `http://localhost:3000/dashboard`

---

## 📄 License

This project is licensed under the MIT License.
