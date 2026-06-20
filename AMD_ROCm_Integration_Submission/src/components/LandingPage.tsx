import React from "react";
import { 
  ArrowRight, 
  Leaf, 
  Cpu, 
  MapPin, 
  LineChart, 
  Coins, 
  Activity, 
  Settings2, 
  TrendingUp,
  Server,
  Workflow,
  Sparkles
} from "lucide-react";
import { CarbonMetrics } from "../types";

interface LandingPageProps {
  carbon: CarbonMetrics;
  onEnterApp: () => void;
}

export default function LandingPage({ carbon, onEnterApp }: LandingPageProps) {
  return (
    <div className="bg-gray-50 min-h-screen selection:bg-emerald-100 font-sans text-gray-800">
      
      {/* Hero Banner Grid representing Smart Cities */}
      <div className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-gray-100">
        
        {/* Decorative Grid SVG background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
        <div className="absolute -left-48 top-1/4 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl"></div>
        <div className="absolute -right-48 bottom-1/4 h-96 w-96 rounded-full bg-teal-100/50 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            {/* Tagline */}
            <div className="mx-auto mb-6 flex max-w-fit items-center justify-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-spin-slow" />
              Circular Economy AI Integration Framework
            </div>

            {/* Display Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto">
              Smart Segregation & <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Recycling Intelligence</span> for Smart Cities
            </h1>

            {/* Explanatory description */}
            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-500 sm:text-lg">
              Automate waste detection, tracking, mapping, and monetization. Powered by real-time YOLOv11 Computer Vision models, ESP32 IoT weight and fill sensors, and a next-generation Circular Waste Marketplace.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onEnterApp}
                id="landing_enter_btn"
                className="group flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-gray-200 hover:bg-emerald-600 hover:shadow-emerald-100 transition-all"
              >
                Launch Enterprise Suite
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="#architecture_reference"
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                System Topology
              </a>
            </div>

          </div>

          {/* High-Fidelity Stats Box Row */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 gap-4 max-w-4xl mx-auto sm:grid-cols-4">
            
            <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:border-emerald-200 transition-all">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Transferred</p>
              <h4 className="mt-2 text-2xl font-extrabold text-gray-900 font-mono">
                {(carbon.totalRecycledKg / 1000).toFixed(1)}t
              </h4>
              <p className="mt-1 text-xs text-gray-500">Autonomous Raw Sorting</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:border-emerald-200 transition-all">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">CO2 Equivalent Saved</p>
              <h4 className="mt-2 text-2xl font-extrabold text-emerald-600 font-mono">
                {(carbon.co2SavedKg / 1000).toFixed(1)}t
              </h4>
              <p className="mt-1 text-xs text-gray-500">Emission Abatements</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:border-emerald-200 transition-all">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Landfill Diversion</p>
              <h4 className="mt-2 text-2xl font-extrabold text-indigo-600 font-mono">
                {carbon.landfillDiversionRate}%
              </h4>
              <p className="mt-1 text-xs text-gray-500">Zero-Waste Score</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:border-emerald-200 transition-all">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Circular Revenue</p>
              <h4 className="mt-2 text-2xl font-extrabold text-amber-600 font-mono">
                ${carbon.revenueGeneratedUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h4>
              <p className="mt-1 text-xs text-gray-500">Disbursed to Smart Hubs</p>
            </div>

          </div>

        </div>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Automating the Circular Lifecycle end-to-end
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Hardware Sensor Fusion, Edge Classification, Route Optimization, and Recycler Auctions orchestrated by single decentralized engine.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1 */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">GPU Edge Inference (YOLO / SAM)</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Detects object boundaries using RT-DETR and segment precise polygon boundaries with Segment Anything 2 (SAM2) for detailed material weight-to-volume ratio calculations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">ESP32 & Multi-Sensor Fusion</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Collects high-frequency raw load data via HX711 cells and ultrasonic depth measurements. The fusion engine validates visual density predictions to ensure material categorization correctness.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Graph-Based Route Optimization</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Analyzes real-time bin levels, transit conditions, and weight capacity of individual collection trucks to schedule priority collection nodes, minimizing overall fuel consumption.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Coins className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Bilateral AI Recycling Marketplace</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Connect registered certified recycler partners directly with smart campus brokers, generating dynamic price evaluations based on material volume weight and pureness indexes.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <LineChart className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Smart City Analytics & Forecasts</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Utilizes regression algorithms to forecast daily community trash levels, helping city architects isolate waste production hotspots and configure preventative alerts.
            </p>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 hover:border-emerald-200 transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Settings2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">Granular Role RBAC Access</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Equips field operations with bin alerts, municipal managers with macro charts, recycling plants with quality control systems, and administrators with model hyperparameters.
            </p>
          </div>

        </div>
      </div>

      {/* High-Fidelity Architecture Diagram Section */}
      <section id="architecture_reference" className="bg-white py-16 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold uppercase tracking-wider mb-2">
              <Workflow className="h-4 w-4" /> System Topology & Signal Flow
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Enterprise Sensor-to-Broker Flow Layout
            </h2>
            <p className="text-xs text-gray-400 mt-2">
              How EcoSort AI links edge telemetry widgets and GPU inference pipelines into circular economy revenue ledgers.
            </p>
          </div>

          {/* Graphical flow diagram created purely in CSS */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-4 relative">
              
              {/* Box 1: Ingestion */}
              <div className="rounded-xl bg-white p-4 text-center border border-gray-200 shadow-sm relative">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-sm">
                  1
                </div>
                <h4 className="text-xs font-bold text-gray-950">Edge Telemetry</h4>
                <p className="text-[10px] text-gray-400 mt-1">Camera Feeds & ESP32 Smart Nodes (HX711 / Ultrasonic)</p>
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-gray-400">➔</div>
              </div>

              {/* Box 2: GPU Pipeline */}
              <div className="rounded-xl bg-white p-4 text-center border border-indigo-200 shadow-sm relative">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">
                  2
                </div>
                <h4 className="text-xs font-bold text-indigo-950">GPU AI Engine</h4>
                <p className="text-[10px] text-indigo-500 mt-1">YOLOv11 BBoxes, SAM2 Fine Segmentor & Gemini Classification</p>
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-indigo-400">➔</div>
              </div>

              {/* Box 3: Synchronizer / SSE Core */}
              <div className="rounded-xl bg-white p-4 text-center border border-gray-200 shadow-sm relative">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold text-sm">
                  3
                </div>
                <h4 className="text-xs font-bold text-gray-950">Decentral Core</h4>
                <p className="text-[10px] text-gray-400 mt-1">Redis Invalidation, Weight Congruency & Real-Time Sync Loop</p>
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-gray-400">➔</div>
              </div>

              {/* Box 4: Broker Brokerage */}
              <div className="rounded-xl bg-white p-4 text-center border border-emerald-200 shadow-sm relative">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600 font-bold text-sm">
                  4
                </div>
                <h4 className="text-xs font-bold text-teal-950">Circular Economy</h4>
                <p className="text-[10px] text-teal-600 mt-1">AI Market pricing valuation & Certified Recycler Auctions</p>
              </div>

            </div>

            <div className="mt-8 rounded-lg bg-white p-4 border border-gray-200/60 font-mono text-[10px] text-gray-500 leading-relaxed">
              <div className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                <Server className="h-3 w-3 text-emerald-500" /> [NETWORK SYSTEM PROTOCOL REPORT]
              </div>
              &gt; Handshaking ESP32 Gateways... OK (Port 3000 Sync)<br />
              &gt; Pipeline latency initialized at 14.2ms | YOLOv11 Multi-threaded execution successfully spawned on Host API<br />
              &gt; Carbon Ledgers bound to active circular transactions (USD equivalent generated from recyclable scrap auctioning)
            </div>

          </div>

        </div>
      </section>

      {/* Elegant CTA Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-2 text-white font-extrabold mb-4">
            <Leaf className="text-emerald-400 h-5 w-5" /> EcoSort AI Hub
          </div>
          <p className="text-xs text-gray-500">
            Enterprise Municipal City Infrastructure Integration • Ready for Smart Cities Initiative 2026
          </p>
          <div className="mt-6">
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
            >
              Access Operator Console <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
