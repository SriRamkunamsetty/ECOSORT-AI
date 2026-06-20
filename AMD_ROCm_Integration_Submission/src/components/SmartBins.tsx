import React, { useState, useEffect } from "react";
import { SmartBin } from "../types";
import { 
  Trash2, 
  Battery, 
  Thermometer, 
  Clock, 
  Wifi, 
  MapPin, 
  Sparkles,
  AlertOctagon,
  RefreshCw,
  Cpu, 
  Upload,
  QrCode,
  Wrench,
  CheckSquare,
  Camera,
  TrendingUp,
  Video,
  History
} from "lucide-react";

interface SmartBinsProps {
  bins: SmartBin[];
  onTriggerIotPayload: (binId: string, payload: {
    fillLevel: number;
    weight: number;
    temperature: number;
    battery: number;
  }) => Promise<any>;
}

// Mini SVG QR Code Component representing a dynamic hardware label
const MiniQRCode = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" className="bg-white p-1 rounded-lg border border-gray-150 shadow-sm shrink-0">
    {/* QR Anchor Corners */}
    <rect x="0" y="0" width="30" height="30" fill="#1f2937" />
    <rect x="6" y="6" width="18" height="18" fill="white" />
    <rect x="11" y="11" width="8" height="8" fill="#1f2937" />

    <rect x="70" y="0" width="30" height="30" fill="#1f2937" />
    <rect x="76" y="6" width="18" height="18" fill="white" />
    <rect x="81" y="11" width="8" height="8" fill="#1f2937" />

    <rect x="0" y="70" width="30" height="30" fill="#1f2937" />
    <rect x="6" y="76" width="18" height="18" fill="white" />
    <rect x="11" y="81" width="8" height="8" fill="#1f2937" />

    {/* Mock dynamic pixels */}
    <rect x="40" y="10" width="10" height="20" fill="#1f2937" />
    <rect x="55" y="5" width="8" height="8" fill="#1f2937" />
    <rect x="40" y="40" width="20" height="10" fill="#1f2937" />
    <rect x="10" y="45" width="12" height="12" fill="#1f2937" />
    <rect x="80" y="40" width="10" height="20" fill="#1f2937" />
    <rect x="45" y="70" width="15" height="10" fill="#1f2937" />
    <rect x="75" y="75" width="15" height="15" fill="#1f2937" />
  </svg>
);

export default function SmartBins({ bins, onTriggerIotPayload }: SmartBinsProps) {
  const [selectedBinId, setSelectedBinId] = useState<string>(bins[0]?.id || "");
  const [simulatedFill, setSimulatedFill] = useState<number>(85);
  const [simulatedWeight, setSimulatedWeight] = useState<number>(24.5);
  const [simulatedTemp, setSimulatedTemp] = useState<number>(31.5);
  const [simulatedBattery, setSimulatedBattery] = useState<number>(90);
  const [loading, setLoading] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // QR Code camera scanner overlay state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBin, setScannedBin] = useState<SmartBin | null>(null);
  const [qrNotification, setQrNotification] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    sensorVerified: false,
    antennaChecked: false,
    outerShelterInspected: false,
    weightCalibrated: false
  });

  // Active Simulating Bin pointer
  const activeSimulatingBin = bins.find(b => b.id === selectedBinId);

  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBinId) return;

    setLoading(true);
    setSubmitFeedback(null);

    try {
      await onTriggerIotPayload(selectedBinId, {
        fillLevel: Number(simulatedFill),
        weight: Number(simulatedWeight),
        temperature: Number(simulatedTemp),
        battery: Number(simulatedBattery)
      });
      setSubmitFeedback(`Successfully transmitted ESP32 RF Frame for ${activeSimulatingBin?.name}! Server storage updated immediately.`);
      setTimeout(() => setSubmitFeedback(null), 4000);
    } catch (err) {
      console.error(err);
      setSubmitFeedback("Failed to authenticate payload transmission.");
    } finally {
      setLoading(false);
    }
  };

  // Helper calculation for Predictive Maintenance durations until critical capacity (90%+)
  const computePredictiveHours = (bin: SmartBin) => {
    // Determine fill velocity based on bin type (Organic & Plastics accumulate faster in mock models)
    let fillPctPerHour = 1.2;
    if (bin.binType === "Organic") fillPctPerHour = 2.4;
    else if (bin.binType === "Plastic") fillPctPerHour = 1.9;
    else if (bin.binType === "Hazardous") fillPctPerHour = 0.8;
    else if (bin.binType === "Metal") fillPctPerHour = 1.3;
    else if (bin.binType === "Glass") fillPctPerHour = 0.9;

    // Weight modifier accounts for heavier load averages
    const weightFactor = Math.min(2.0, bin.weight * 0.04 + 0.82);
    const finalVelocity = fillPctPerHour * weightFactor;

    const remainingTo90 = Math.max(0, 90 - bin.fillLevel);
    const hrsRemaining = remainingTo90 === 0 ? 0 : Number((remainingTo90 / finalVelocity).toFixed(1));

    let priority: "Urgent Dispatch" | "Proactive Warn" | "Optimal Standby" = "Optimal Standby";
    if (hrsRemaining <= 4.0 || bin.fillLevel >= 90) {
      priority = "Urgent Dispatch";
    } else if (hrsRemaining <= 12.0) {
      priority = "Proactive Warn";
    }

    return {
      velocity: Number(finalVelocity.toFixed(1)),
      hours: hrsRemaining,
      priority
    };
  };

  // Trigger simulated collection scheduling
  const handleProactiveSchedule = (binName: string) => {
    setQrNotification(`🔄 Proactive maintenance dispatched! Collection truck has been prioritized for ${binName} to preempt critical overflow.`);
    setTimeout(() => setQrNotification(null), 4000);
  };

  // Handle simulated camera scan of a specific physical bin QR code labels
  const handleOpenScanner = () => {
    setIsScanning(true);
    setScannedBin(null);
  };

  const handleSimulatedScan = (bin: SmartBin) => {
    setQrNotification(`🟢 QR Code Label Decrypted: [HEXADDR:${bin.id}]`);
    setTimeout(() => {
      setScannedBin(bin);
      setIsScanning(false);
      setQrNotification(null);
      // Reset checklist
      setChecklist({
        sensorVerified: false,
        antennaChecked: false,
        outerShelterInspected: false,
        weightCalibrated: false
      });
    }, 1000);
  };

  const handleChecklistChange = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveInspection = () => {
    setQrNotification(`✅ Physical maintenance inspection logged successfully for ${scannedBin?.name}!`);
    setTimeout(() => {
      setScannedBin(null);
      setQrNotification(null);
    }, 3000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Critical": return "bg-rose-50 text-rose-700 border-rose-250 animate-pulse";
      case "Warning": return "bg-amber-50 text-amber-700 border-amber-205";
      default: return "bg-emerald-50 text-emerald-700 border-emerald-250";
    }
  };

  const getBinTypeColorBadge = (type: string) => {
    switch (type) {
      case "Plastic": return "bg-blue-500/10 text-blue-600 border-blue-100";
      case "Glass": return "bg-cyan-500/10 text-cyan-600 border-cyan-100";
      case "Metal": return "bg-amber-500/10 text-amber-600 border-amber-100";
      case "Organic": return "bg-emerald-500/10 text-emerald-600 border-emerald-100";
      case "Hazardous": return "bg-rose-500/10 text-rose-600 border-rose-100";
      case "E-Waste": return "bg-purple-500/10 text-purple-600 border-purple-100";
      default: return "bg-gray-500/10 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      
      {/* LEFT COLUMN: Smart Bins Grid and Predictive Maintenance */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Dynamic Warning Notification Banner */}
        {qrNotification && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 text-xs text-indigo-800 flex items-center justify-between shadow-sm animate-fade-in z-20">
            <span className="flex items-center gap-1.5 font-medium leading-normal">
              <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse-slow shrink-0" />
              {qrNotification}
            </span>
            <button onClick={() => setQrNotification(null)} className="font-bold underline text-indigo-600 text-[10px] uppercase ml-2">Dismiss</button>
          </div>
        )}

        {/* Section 1 Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Trash2 className="h-4.5 w-4.5 text-emerald-500" />
              Smart Bins Cluster Status
            </h3>
            <p className="text-[11px] text-gray-400 font-sans">Autonomous ESP32 load cell measurements & ultrasonic height indicators</p>
          </div>

          <span className="rounded-full bg-emerald-50 border border-emerald-205 px-2.5 py-0.5 font-mono text-[9px] font-bold text-emerald-700 flex items-center gap-1">
            <Wifi className="h-3 w-3 text-emerald-500 animate-pulse-slow" /> GATEWAY: ACTIVE
          </span>
        </div>

        {/* Smart Bins List Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {bins.map((bin) => {
            const isCritical = bin.fillLevel >= 90;
            return (
              <div 
                key={bin.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 hover:border-emerald-500 active:ring-1 active:ring-emerald-200 hover:shadow-md hover:shadow-gray-100/50 transition-all space-y-4 relative"
              >
                
                {/* Heading details */}
                <div className="flex items-start justify-between border-b border-gray-50 pb-2">
                  <div className="max-w-[65%]">
                    <h4 className="font-sans text-xs font-bold text-gray-950 truncate" title={bin.name}>{bin.name}</h4>
                    <p className="font-sans text-[10px] text-gray-400 truncate flex items-center gap-0.5 mt-0.5">
                      <MapPin className="h-2.5 w-2.5 shrink-0" /> {bin.zone}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold border ${getStatusStyle(bin.status)}`}>
                      {bin.status}
                    </span>
                  </div>
                </div>

                {/* Main Fill Level Meter bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 mb-1 leading-none">
                    <span>Fill Level Bar:</span>
                    <span className={`font-black ${isCritical ? "text-rose-600 animate-pulse" : "text-gray-950"}`}>{bin.fillLevel}%</span>
                  </div>

                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${isCritical ? "bg-rose-500" : bin.fillLevel >= 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${bin.fillLevel}%` }}
                    ></div>
                  </div>
                </div>

                {/* Telemetry Matrix Grid */}
                <div className="grid grid-cols-2 gap-2 border-t border-gray-50 pt-2 font-mono text-[9px] text-gray-500 leading-none">
                  
                  {/* Weight sensor */}
                  <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded border border-gray-100">
                    <Trash2 className="h-3 w-3 text-gray-400" />
                    <div>
                      <span className="block text-gray-400">HX711 Weight</span>
                      <strong className="text-gray-950 mt-0.5 block">{bin.weight} kg</strong>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded border border-gray-100">
                    <Thermometer className="h-3 w-3 text-gray-400" />
                    <div>
                      <span className="block text-gray-400">Internal Heat</span>
                      <strong className="text-gray-950 mt-0.5 block">{bin.temperature} °C</strong>
                    </div>
                  </div>

                  {/* Battery */}
                  <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded border border-gray-100 col-span-1">
                    <Battery className="h-3 w-3 text-gray-400" />
                    <div>
                      <span className="block text-gray-400">IoT Cell</span>
                      <strong className="text-gray-950 mt-0.5 block">{bin.battery}%</strong>
                    </div>
                  </div>

                  {/* LSTM Clock prediction */}
                  <div className="flex items-center gap-1 bg-indigo-50/50 p-1.5 rounded border border-indigo-100/50 col-span-1">
                    <Clock className="h-3 w-3 text-indigo-500" />
                    <div>
                      <span className="block text-indigo-400">LSTM Overflow</span>
                      <strong className="text-indigo-950 mt-0.5 block">{bin.overflowPredictedHours} hrs</strong>
                    </div>
                  </div>

                </div>

                {/* Matching material category designation and QR Code trigger */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-2.5 text-[9px] gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSimulatedScan(bin)}
                      title="Simulate scanning this bin's hardware QR label"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-105 text-gray-600 hover:text-gray-900 font-sans transition-colors shrink-0"
                    >
                      <QrCode className="h-3 w-3 text-emerald-500" />
                      <span>Diagnostics</span>
                    </button>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded border font-semibold shrink-0 ${getBinTypeColorBadge(bin.binType)}`}>
                    {bin.binType} Segregator
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Section 2: Predictive Maintenance Dashboard Panel */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-gray-90 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-650 font-bold border border-teal-100">
                <TrendingUp className="h-4.5 w-4.5 text-teal-600 animate-pulse-slow" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-gray-950">Proactive Maintenance & Rate Regression Predictor</h4>
                <p className="text-[10px] text-gray-400 font-sans">Accumulation velocities calculated across weekly sensor histories</p>
              </div>
            </div>

            <span className="rounded bg-teal-100/35 border border-teal-100 text-teal-800 text-[9px] font-bold font-mono px-2 py-0.5">
              PREDICTIVE HORIZONS: ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-500 font-sans border-collapse">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">
                  <th className="py-2.5">Bin Identity</th>
                  <th className="py-2.5 px-2 text-center">Fill Level</th>
                  <th className="py-2.5 text-center">Dynamic fill rate</th>
                  <th className="py-2.5 text-center">time to overflow (90%)</th>
                  <th className="py-2.5 text-center">Action Priority</th>
                  <th className="py-2.5 text-right">Preventive Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-sans">
                {bins.map((bin) => {
                  const analytics = computePredictiveHours(bin);
                  const isUrgent = analytics.priority === "Urgent Dispatch";
                  const isWarn = analytics.priority === "Proactive Warn";
                  
                  return (
                    <tr key={bin.id} className="hover:bg-gray-55/35 transition-colors">
                      <td className="py-3">
                        <div className="font-semibold text-gray-900 truncate max-w-[150px]">{bin.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]">{bin.zone}</div>
                      </td>
                      
                      <td className="py-3 px-2 text-center">
                        <div className="font-mono font-bold text-gray-900">{bin.fillLevel}%</div>
                        <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${bin.fillLevel >= 90 ? "bg-rose-500" : bin.fillLevel >= 75 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${bin.fillLevel}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 text-center font-mono text-gray-600">
                        ⚡ {analytics.velocity}% / hr
                      </td>

                      <td className="py-3 text-center font-mono">
                        {analytics.hours === 0 ? (
                          <span className="text-rose-600 font-bold animate-pulse">Critical Overflow</span>
                        ) : (
                          <span className={`font-bold ${isUrgent ? "text-rose-600" : isWarn ? "text-amber-600" : "text-gray-900"}`}>
                            {analytics.hours} Hours
                          </span>
                        )}
                      </td>

                      <td className="py-3 text-center">
                        <span className={`inline-block text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded-full border ${
                          isUrgent ? 'bg-rose-50 border-rose-150 text-rose-700 animate-pulse' :
                          isWarn ? 'bg-amber-50 border-amber-150 text-amber-700' :
                          'bg-emerald-50 border-emerald-150 text-emerald-700'
                        }`}>
                          {analytics.priority}
                        </span>
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleProactiveSchedule(bin.name)}
                          id={`proactive_schedule_btn_${bin.id}`}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-all focus:outline-none ${
                            isUrgent ? 'bg-rose-600 hover:bg-rose-700 text-white' :
                            isWarn ? 'bg-gray-900 hover:bg-emerald-600 text-white' :
                            'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {isUrgent ? "FORCE DRAIN" : "DISPATCH NOW"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-[10px] font-sans text-gray-400 leading-relaxed pt-2">
            *Regression rates calculate fill speeds based on physical load parameters and chemical gas release speeds, allowing dispatch operators to proactively empty bins before they overflow.
          </p>
        </div>

      </div>

      {/* RIGHT COLUMN: QR Viewfinder and ESP32 Sandbox */}
      <div className="space-y-6">

        {/* QR Code Diagnostics Viewfinder */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3 justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Camera className="h-4.5 w-4.5 animate-pulse-slow" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-gray-955">QR Diagnostics Terminal</h4>
                <p className="text-[10px] text-gray-400">Scan hardware labels for sensor verification</p>
              </div>
            </div>

            <button
              onClick={handleOpenScanner}
              disabled={isScanning}
              id="open_qr_viewfinder_btn"
              className="px-2.5 py-1 text-[10px] border border-emerald-100 bg-emerald-50/50 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Scan Live QR
            </button>
          </div>

          {/* VIEW 1: Scanning mode viewfinder */}
          {isScanning ? (
            <div className="rounded-xl border border-dashed border-emerald-300 bg-gray-950 p-4 relative overflow-hidden transition-all duration-300">
              
              {/* Vertical Glowing Scanning Laser Line */}
              <div className="absolute left-0 w-full bg-emerald-400/60 shadow-[0_0_8px_rgba(52,211,153,0.8)] h-0.5 animate-bounce z-10" style={{ animationDuration: "2.8s" }} />

              <div className="flex flex-col items-center justify-center py-6 text-center text-white space-y-3">
                <Video className="h-10 w-10 text-emerald-400 animate-pulse" />
                <div>
                  <h5 className="font-mono font-bold text-[11px] uppercase text-emerald-400 tracking-wider">Simulated Camera Viewfinder</h5>
                  <p className="text-[9px] text-gray-400 font-sans max-w-[200px] mt-1">Positioning camera... Click a target below to load specific physical bin label QR Code:</p>
                </div>

                {/* Simulated Target Buttons inside the feed */}
                <div className="grid grid-cols-2 gap-1.5 w-full pt-3 z-10">
                  {bins.map(bin => (
                    <button
                      key={bin.id}
                      onClick={() => handleSimulatedScan(bin)}
                      className="px-2 py-1 bg-gray-900 border border-gray-700 hover:border-emerald-400 rounded text-[9px] font-mono text-gray-300 hover:text-emerald-300 truncate"
                    >
                      📟 Scan {bin.id.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsScanning(false)}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-[10px] rounded hover:bg-rose-900/40 hover:text-rose-200 transition-colors font-sans mt-2"
                >
                  Cancel Scanner
                </button>
              </div>
            </div>
          ) : scannedBin ? (
            /* VIEW 2: Scanned results and operator checklist dashboard */
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/10 p-4.5 space-y-4 animate-fade-in text-xs">
              
              <div className="flex items-start justify-between border-b border-emerald-100 pb-2">
                <div>
                  <span className="text-[9px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    DEC DECRYPTED (HEXADDR:{scannedBin.id})
                  </span>
                  <h4 className="font-sans text-sm font-bold text-gray-950 mt-1">{scannedBin.name}</h4>
                </div>
                <button onClick={() => setScannedBin(null)} className="text-gray-400 hover:text-rose-600 font-bold font-sans">✕ Close</button>
              </div>

              {/* Advanced telemetry readouts */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 bg-white rounded border border-emerald-100/50">
                  <span className="block text-gray-400">DHT22 absolute Humid</span>
                  <strong className="text-gray-800">42.5% RH</strong>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100/50">
                  <span className="block text-gray-400">MCU Voltage Cell</span>
                  <strong className="text-gray-800">5.02 V (Normal)</strong>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100/50">
                  <span className="block text-gray-400">Cell Antenna SNR</span>
                  <strong className="text-emerald-700">+22.4 dB (High)</strong>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100/50">
                  <span className="block text-gray-400">Firmware Build</span>
                  <strong className="text-gray-800">v11.8b-ESP32</strong>
                </div>
              </div>

              {/* Maintenance physical review check-list */}
              <div className="space-y-2 border-t border-emerald-100/50 pt-3">
                <h5 className="font-sans text-[10px] font-bold text-gray-950 uppercase tracking-wide flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-emerald-500" />
                  Field Operator Maintenance Diagnostics Checklist:
                </h5>

                <div className="space-y-1.5 pt-1 text-[10px]">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 select-none">
                    <input
                      type="checkbox"
                      checked={checklist.sensorVerified}
                      onChange={() => handleChecklistChange("sensorVerified")}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Ultrasonic transducer glass lens cleaned</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 select-none">
                    <input
                      type="checkbox"
                      checked={checklist.antennaChecked}
                      onChange={() => handleChecklistChange("antennaChecked")}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Verified ESP32 IPEX RF connection & casing seal</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 select-none">
                    <input
                      type="checkbox"
                      checked={checklist.outerShelterInspected}
                      onChange={() => handleChecklistChange("outerShelterInspected")}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Verified outer lid lock pivot & bin hinge alignment</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900 select-none">
                    <input
                      type="checkbox"
                      checked={checklist.weightCalibrated}
                      onChange={() => handleChecklistChange("weightCalibrated")}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Zeroed static strain offsets on baseline Load Cell</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSaveInspection}
                id="save_inspection_btn"
                className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-gray-900 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors text-[11px]"
              >
                <CheckSquare className="h-3.5 w-3.5" /> Log Physical Verification Report
              </button>

            </div>
          ) : (
            /* VIEW 3: Default inactive state view instructions */
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 text-center space-y-3">
              <QrCode className="h-10 w-10 text-gray-300 mx-auto" />
              <div>
                <h5 className="font-sans text-xs font-bold text-gray-900	">Diagnostics Terminal Awaiting Scan</h5>
                <p className="text-[10px] text-gray-400 font-sans leading-relaxed max-w-[210px] mx-auto mt-1">
                  Click the <strong>Diagnostics</strong> label button under any Sector Bin Status card above to instantly emulate scanning its physical ID tag.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Control Module: ESP32 Hardware payload sandbox */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 shadow">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-sans text-xs font-bold text-gray-955">ESP32 RF / GPRS Simulator</h3>
              <p className="text-[9px] text-gray-400">Mock raw micro-controller UDP telemetry frames</p>
            </div>
          </div>

          <form onSubmit={handleSimulateSubmit} className="space-y-4">
            
            {/* Bin Selection */}
            <div>
              <label htmlFor="sim_bin_select" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Target Physical Bin Address:
              </label>
              <select
                id="sim_bin_select"
                value={selectedBinId}
                onChange={(e) => {
                  setSelectedBinId(e.target.value);
                  const b = bins.find(bin => bin.id === e.target.value);
                  if (b) {
                    setSimulatedFill(b.fillLevel);
                    setSimulatedWeight(b.weight);
                    setSimulatedTemp(b.temperature);
                    setSimulatedBattery(b.battery);
                  }
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-semibold text-gray-700"
              >
                {bins.map((bin) => (
                  <option key={bin.id} value={bin.id}>{bin.name} ({bin.binType})</option>
                ))}
              </select>
            </div>

            {/* Ultrasonic Fill Level Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="sim_fill_slider" className="font-medium text-gray-700">Ultrasonic Depth (Fill %):</label>
                <span className="font-bold font-mono text-gray-900">{simulatedFill}%</span>
              </div>
              <input
                id="sim_fill_slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={simulatedFill}
                onChange={(e) => {
                  setSimulatedFill(Number(e.target.value));
                  // Auto increase simulated weight proportionally for standard materials
                  setSimulatedWeight(Number((Number(e.target.value) * 0.35 + 2).toFixed(1)));
                }}
                className="w-full cursor-pointer accent-indigo-600 bg-gray-100 rounded-lg h-1"
              />
            </div>

            {/* HX711 Load Cell Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="sim_weight_slider" className="font-medium text-gray-700">HX711 Strain Weight (kg):</label>
                <span className="font-bold font-mono text-gray-900">{simulatedWeight} kg</span>
              </div>
              <input
                id="sim_weight_slider"
                type="range"
                min="1.0"
                max="50.0"
                step="0.5"
                value={simulatedWeight}
                onChange={(e) => setSimulatedWeight(Number(e.target.value))}
                className="w-full cursor-pointer accent-indigo-600 bg-gray-100 rounded-lg h-1"
              />
            </div>

            {/* Micro-Controller Battery cell */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="sim_battery_slider" className="font-medium text-gray-700">ESP32 Cell Voltage (Battery %):</label>
                <span className="font-bold font-mono text-gray-900">{simulatedBattery}%</span>
              </div>
              <input
                id="sim_battery_slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={simulatedBattery}
                onChange={(e) => setSimulatedBattery(Number(e.target.value))}
                className="w-full cursor-pointer accent-indigo-600 bg-gray-100 rounded-lg h-1"
              />
            </div>

            {/* Temperature cell helper */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="sim_temp_slider" className="font-medium text-gray-700">Internal Thermostat (°C):</label>
                <span className="font-bold font-mono text-gray-900">{simulatedTemp} °C</span>
              </div>
              <input
                id="sim_temp_slider"
                type="range"
                min="15"
                max="55"
                step="1"
                value={simulatedTemp}
                onChange={(e) => setSimulatedTemp(Number(e.target.value))}
                className="w-full cursor-pointer accent-indigo-600 bg-gray-100 rounded-lg h-1"
              />
            </div>

            {/* Actions Submit */}
            <button
              type="submit"
              disabled={loading}
              id="iot_payload_submit_btn"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md disabled:bg-gray-200 transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Verifying Frame alignment...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Transmit ESP32 Frame
                </>
              )}
            </button>

            {/* Display operation results feedback */}
            {submitFeedback && (
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3.5 text-[10px] text-indigo-700 leading-relaxed font-mono animate-fade-in">
                ⚡ {submitFeedback}
              </div>
            )}

          </form>

        </div>

      </div>

    </div>
  );
}
