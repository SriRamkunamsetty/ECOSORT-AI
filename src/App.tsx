import React, { useState, useEffect } from "react";
import { SystemState, UserRole, WasteDetection, SmartBin, CollectionRoute, MarketplaceAuction, CarbonMetrics, Alert, GPUMetrics } from "./types";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import LiveMonitor from "./components/LiveMonitor";
import SmartBins from "./components/SmartBins";
import Analytics from "./components/Analytics";
import Routing from "./components/Routing";
import Marketplace from "./components/Marketplace";
import AdminPanel from "./components/AdminPanel";
import { 
  Building2, 
  Camera, 
  MapPin, 
  Coins, 
  ShieldAlert, 
  Leaf, 
  Activity, 
  Compass, 
  LineChart, 
  Bell, 
  X, 
  CheckCircle, 
  Lock 
} from "lucide-react";

export default function App() {
  const [inAppMode, setInAppMode] = useState(false);
  const [activeTab, setActiveTab] = useState("monitor");
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);

  // Core application state synchronized from server
  const [state, setState] = useState<SystemState>({
    detections: [],
    bins: [],
    routes: [],
    auctions: [],
    carbon: {
      totalRecycledKg: 78540,
      co2SavedKg: 122480,
      landfillDiversionRate: 84.6,
      energySavedMwh: 128.5,
      revenueGeneratedUsd: 14240.0
    },
    alerts: [],
    gpu: {
      gpuUtilization: 0,
      vramTotalMb: 16384,
      vramUsedMb: 0,
      temperatureCelsius: 0,
      activeStreamsCount: 0,
      inferenceSpeedMs: 0
    },
    activeRole: "Municipal Manager",
    detectionThreshold: 0.65,
    isStreamActive: true,
    conveyorRunning: true,
    activeCameraId: "cam-1"
  });

  const [loadingInitial, setLoadingInitial] = useState(true);

  // Synchronize state periodically from Express Backend Engine
  const fetchServerState = async () => {
    try {
      const response = await fetch("/api/state");
      if (response.ok) {
        const data = await response.json();
        setState((prev) => ({
          ...prev,
          detections: data.detections,
          bins: data.bins,
          routes: data.routes,
          auctions: data.auctions,
          carbon: data.carbon,
          alerts: data.alerts,
          gpu: data.gpu,
          activeRole: data.activeRole,
          detectionThreshold: data.detectionThreshold,
          isStreamActive: data.isStreamActive,
          conveyorRunning: data.conveyorRunning,
          activeCameraId: data.activeCameraId
        }));
      }
    } catch (err) {
      console.error("Inability to handshake server synchronization cycle:", err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchServerState();

    // High fidelity poll synchronization every 1.5 seconds for instant reactive dashboard feeds
    const streamPoller = setInterval(fetchServerState, 1500);
    return () => clearInterval(streamPoller);
  }, []);

  // Handler: Change active Operator role
  const handleRoleChange = async (role: UserRole) => {
    try {
      const res = await fetch("/api/admin/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        setState((prev) => ({ ...prev, activeRole: role }));
        
        // Auto jump to allowed tabs to improve UX speed
        if (role === "Field Operator" && activeTab !== "monitor" && activeTab !== "bins" && activeTab !== "routing") {
          setActiveTab("bins");
        } else if (role === "Recycling Plant Operator" && activeTab !== "monitor" && activeTab !== "marketplace") {
          setActiveTab("marketplace");
        } else if (role === "Admin" && activeTab !== "admin" && activeTab !== "monitor") {
          setActiveTab("admin");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Modify camera and model hyperparameter configurations on server
  const handleConfigChange = async (updates: Partial<{
    detectionThreshold: number;
    isStreamActive: boolean;
    conveyorRunning: boolean;
    activeCameraId: string;
  }>) => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const bodyObj = await res.json();
        setState((prev) => ({
          ...prev,
          detectionThreshold: bodyObj.config.detectionThreshold,
          isStreamActive: bodyObj.config.isStreamActive,
          conveyorRunning: bodyObj.config.conveyorRunning,
          activeCameraId: bodyObj.config.activeCameraId
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Scan item with Gemini model
  const handleManualScan = async (textDescription: string) => {
    const res = await fetch("/api/detection/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textDescription })
    });
    const parsed = await res.json();
    fetchServerState(); // immediately catch emissions updates
    return parsed;
  };

  // Handler: Modify ESP32 simulated inputs
  const handleTriggerIotPayload = async (binId: string, payload: {
    fillLevel: number;
    weight: number;
    temperature: number;
    battery: number;
  }) => {
    const res = await fetch(`/api/bins/${binId}/iot-payload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const parsed = await res.json();
    fetchServerState();
    return parsed;
  };

  // Handler: Run GPS TSP Optimization Graph routing on the server
  const handleTriggerOptimization = async () => {
    const res = await fetch("/api/route/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startLocation: { lat: 1.2885, lng: 103.8495 }
      })
    });
    const parsed = await res.json();
    fetchServerState();
    return parsed;
  };

  // Handler: Listing new auction batches
  const handleAddAuction = async (payload: {
    title: string;
    category: string;
    quantityKg: number;
    estimatedPricePerKg: number;
  }) => {
    const res = await fetch("/api/marketplace/auction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const parsed = await res.json();
    fetchServerState();
    return parsed;
  };

  // Handler: Transacting/Settling auctions and transferring Circular capitals
  const handleAcceptTopBid = async (auctionId: string) => {
    const res = await fetch("/api/marketplace/accept-bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId })
    });
    const parsed = await res.json();
    fetchServerState();
    return parsed;
  };

  // Handler: Acknowledge alerts
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await fetch("/api/alerts/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId })
      });
      fetchServerState();
    } catch (err) {
      console.error(err);
    }
  };

  // RBAC Permission Check Rules
  const canAccessTab = (tab: string, role: UserRole): boolean => {
    if (role === "Admin") return true; // Administrator holds global overrides
    
    if (tab === "admin") return false; // restricted to Admins
    if (tab === "marketplace") {
      return role === "Recycling Plant Operator";
    }
    if (tab === "routing") {
      return role === "Field Operator" || role === "Municipal Manager";
    }
    if (tab === "analytics") {
      return role === "Municipal Manager";
    }
    
    // Default screens visible to any roles
    return true;
  };

  // Render restrained block
  const renderAccessWarning = (requiredRole: string) => (
    <div className="mx-auto max-w-md my-16 text-center rounded-2xl border border-gray-150 bg-white p-8 shadow-sm space-y-4 animate-fade-in">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-100">
        <Lock className="h-6 w-6" />
      </div>
      <div>
        <h4 className="font-sans text-sm font-bold text-gray-900">Access Restricted</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          Your active profile parameters lack clearance for this operational hub. Access to this subsystem requires <strong>{requiredRole}</strong> RBAC scope credentials.
        </p>
      </div>
      <div className="border-t border-gray-100 pt-4 text-xs text-gray-400">
        Use the profile switcher in the top header to evaluate other simulation screens!
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans antialiased text-gray-800">
      
      {/* If we are on first landing preview, greet with professional cover */}
      {!inAppMode ? (
        <LandingPage 
          carbon={state.carbon} 
          onEnterApp={() => setInAppMode(true)} 
        />
      ) : (
        <>
          {/* Executive telemetry aligned Header */}
          <Header 
            activeRole={state.activeRole}
            onRoleChange={handleRoleChange}
            gpu={state.gpu}
            carbon={state.carbon}
            alerts={state.alerts}
            onTriggerAlertsModal={() => setAlertsModalOpen(true)}
          />

          {/* Subsystem tab drawer rail */}
          <div className="border-b border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-1.5 py-3 overflow-x-auto" aria-label="Subsystems">
                
                {/* 1. Real-Time Monitor */}
                <button
                  onClick={() => setActiveTab("monitor")}
                  id="tab_monitor_btn"
                  className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold flex items-center gap-2 border transition-all ${activeTab === "monitor" ? "bg-gray-900 border-gray-900 text-white shadow shadow-gray-950/20" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-950"}`}
                >
                  <Camera className="h-4 w-4" /> Real-Time Cameras Scan
                </button>

                {/* 2. Smart Bins Inventory */}
                <button
                  onClick={() => setActiveTab("bins")}
                  id="tab_bins_btn"
                  className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold flex items-center gap-2 border transition-all ${activeTab === "bins" ? "bg-gray-900 border-gray-900 text-white shadow shadow-gray-950/20" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-950"}`}
                >
                  <Activity className="h-4 w-4" /> ESP32 Bins Telemetry
                </button>

                {/* 3. Analytics ledger */}
                <button
                  onClick={() => setActiveTab("analytics")}
                  id="tab_analytics_btn"
                  className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold flex items-center gap-2 border transition-all ${activeTab === "analytics" ? "bg-gray-900 border-gray-900 text-white shadow shadow-gray-950/20" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-950"}`}
                >
                  <LineChart className="h-4 w-4" /> Carbon & Impact
                </button>

                {/* 4. Routing pathfinder */}
                <button
                  onClick={() => setActiveTab("routing")}
                  id="tab_routing_btn"
                  className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold flex items-center gap-2 border transition-all ${activeTab === "routing" ? "bg-gray-900 border-gray-900 text-white shadow shadow-gray-950/20" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-950"}`}
                >
                  <Compass className="h-4 w-4" /> AI Fleet Routing
                </button>

                {/* 5. Auction trading */}
                <button
                  onClick={() => setActiveTab("marketplace")}
                  id="tab_marketplace_btn"
                  className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold flex items-center gap-2 border transition-all ${activeTab === "marketplace" ? "bg-gray-900 border-gray-900 text-white shadow shadow-gray-950/20" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-950"}`}
                >
                  <Coins className="h-4 w-4" /> Circular Economy Marketplace
                </button>

                {/* 6. Admin Panel MLOps */}
                <button
                  onClick={() => setActiveTab("admin")}
                  id="tab_admin_btn"
                  className={`rounded-xl px-4 py-2 font-sans text-xs font-semibold flex items-center gap-2 border transition-all ${activeTab === "admin" ? "bg-gray-900 border-gray-900 text-white shadow shadow-gray-950/20" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-950"}`}
                >
                  <Lock className="h-4 w-4" /> MLOps Config (Admin)
                </button>

              </nav>
            </div>
          </div>

          {/* Main workspace frame container */}
          <main className="flex-1 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              {/* Dynamic Loader screen */}
              {loadingInitial ? (
                <div className="text-center py-24 space-y-3">
                  <span className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-emerald-500 border-t-transparent block mb-4"></span>
                  <p className="font-sans text-xs text-gray-500">Connecting node stream servers...</p>
                </div>
              ) : (
                <>
                  {/* Real-Time Cameras Scan segment accessible to any profiles */}
                  {activeTab === "monitor" && (
                    <LiveMonitor 
                      detections={state.detections}
                      gpu={state.gpu}
                      config={{
                        detectionThreshold: state.detectionThreshold,
                        isStreamActive: state.isStreamActive,
                        conveyorRunning: state.conveyorRunning,
                        activeCameraId: state.activeCameraId
                      }}
                      onConfigChange={handleConfigChange}
                      onManualScan={handleManualScan}
                    />
                  )}

                  {/* Smart Bins inventory status */}
                  {activeTab === "bins" && (
                    <SmartBins 
                      bins={state.bins}
                      onTriggerIotPayload={handleTriggerIotPayload}
                    />
                  )}

                  {/* Carbon analytics hub restricted to Municipal Managers and higher */}
                  {activeTab === "analytics" && (
                    canAccessTab("analytics", state.activeRole) ? (
                      <Analytics 
                        carbon={state.carbon}
                        bins={state.bins}
                      />
                    ) : (
                      renderAccessWarning("Municipal Manager")
                    )
                  )}

                  {/* AI Collection Routings restricted to Field Operators / Municipal Managers */}
                  {activeTab === "routing" && (
                    canAccessTab("routing", state.activeRole) ? (
                      <Routing 
                        routes={state.routes}
                        bins={state.bins}
                        onTriggerOptimization={handleTriggerOptimization}
                      />
                    ) : (
                      renderAccessWarning("Field Operator or Municipal Manager")
                    )
                  )}

                  {/* Recycling Marketplace restricted to Recycling Plant Operators */}
                  {activeTab === "marketplace" && (
                    canAccessTab("marketplace", state.activeRole) ? (
                      <Marketplace 
                        auctions={state.auctions}
                        onAddAuction={handleAddAuction}
                        onAcceptTopBid={handleAcceptTopBid}
                      />
                    ) : (
                      renderAccessWarning("Recycling Plant Operator")
                    )
                  )}

                  {/* Admin configuration hyperparameters panel */}
                  {activeTab === "admin" && (
                    canAccessTab("admin", state.activeRole) ? (
                      <AdminPanel 
                        gpu={state.gpu}
                        bins={state.bins}
                      />
                    ) : (
                      renderAccessWarning("Admin (Master Control)")
                    )
                  )}
                </>
              )}

            </div>
          </main>

          {/* Interactive Alerts Notifications Escrow drawer overlay Modal */}
          {alertsModalOpen && (
            <div className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="alerts_modal">
              <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl relative space-y-4">
                
                {/* Header detail */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                    <span>Real-Time Ingestion Logs Notifications Panel</span>
                  </div>

                  <button
                    onClick={() => setAlertsModalOpen(false)}
                    className="rounded bg-gray-50 text-gray-400 hover:text-gray-900 p-1 transition"
                    title="Dismiss Overlay modal window"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Body lists */}
                <div className="space-y-3.5 max-h-96 overflow-y-auto">
                  {state.alerts.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-6 leading-relaxed">All telemetry channels report clean. No alerts pending queue.</p>
                  ) : (
                    state.alerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`rounded-xl border p-3.5 text-xs transition-colors shadow-sm ${alert.acknowledged ? "bg-gray-55/60 border-gray-150 text-gray-450 opacity-60" : alert.severity === "Critical" ? "bg-rose-50/50 border-rose-150 text-rose-955" : "bg-amber-50/45 border-amber-150 text-amber-955"}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] text-gray-400 block">{new Date(alert.timestamp).toLocaleString()}</span>
                            <span className="font-sans font-bold block">{alert.source}</span>
                            <p className="font-sans text-gray-600 mt-1 leading-relaxed">{alert.message}</p>
                          </div>

                          {!alert.acknowledged && (
                            <button
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              className="rounded bg-white border px-2.5 py-1 text-[10px] font-bold text-gray-700 hover:bg-gray-50 transition"
                              title="Mark notify message cleared"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Ledger summary footer */}
                <div className="text-right border-t border-gray-50 pt-3">
                  <button
                    onClick={() => setAlertsModalOpen(false)}
                    className="rounded-lg bg-gray-900 text-white font-bold text-xs px-4 py-2 hover:bg-gray-800 transition"
                  >
                    Close Log view
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Core Footer */}
          <footer className="bg-white border-t border-gray-100 py-6 text-center text-[10px] text-gray-400 leading-relaxed">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              Municipal Waste Segregation Core Engine • EcoSort AI platform • Enterprise Smart City Frameworks 2026
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
