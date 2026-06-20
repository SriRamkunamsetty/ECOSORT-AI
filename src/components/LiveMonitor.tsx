import React, { useState, useEffect } from "react";
import { WasteDetection, GPUMetrics } from "../types";
import { 
  Camera, 
  Play, 
  Square, 
  Cpu, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Settings,
  Flame,
  Layers,
  ArrowRight
} from "lucide-react";

interface LiveMonitorProps {
  detections: WasteDetection[];
  gpu: GPUMetrics;
  config: {
    detectionThreshold: number;
    isStreamActive: boolean;
    conveyorRunning: boolean;
    activeCameraId: string;
  };
  onConfigChange: (updates: Partial<LiveMonitorProps["config"]>) => void;
  onManualScan: (textDescription: string) => Promise<any>;
}

const PRESET_SCAN_SAMPLES = [
  { text: "Crushed aluminum Coca-Cola can", icon: "🥫" },
  { text: "Plastic shampoo container with HDPE emblem", icon: "🧴" },
  { text: "Broken glass vine bottle neck", icon: "🍾" },
  { text: "Organic half-eaten banana peel and coffee grounds", icon: "🍌" },
  { text: "Corrupt battery cell leak hazard", icon: "🔋" },
  { text: "Burnt out computer peripheral PCB board", icon: "🔌" }
];

export default function LiveMonitor({
  detections,
  gpu,
  config,
  onConfigChange,
  onManualScan
}: LiveMonitorProps) {
  const [customInputText, setCustomInputText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Accumulate serial console logs representing physical ESP32/YOLO node broadcasts
  useEffect(() => {
    const handleLogTick = () => {
      const logs = [
        `[YOLO CUDA 11.8] Stream ${config.activeCameraId} - Speed ${gpu.inferenceSpeedMs}ms | VRAM ${gpu.vramUsedMb}MB / ${gpu.vramTotalMb}MB`,
        `[HX711 Node] Conveyor Load Cells calibrated balance tracking... Weight matched`,
        `[ESP32 Gateway] Node UDP frame ack: rssi=-64db | Ping successful`,
        `[SAM2 Engine] Mask computation segment layer 1 overlaps successfully mapped`
      ];
      setConsoleLogs((prev) => {
        const withNew = [...prev, logs[Math.floor(Math.random() * logs.length)]];
        if (withNew.length > 25) withNew.shift();
        return withNew;
      });
    };

    const interval = setInterval(handleLogTick, 2000);
    return () => clearInterval(interval);
  }, [config.activeCameraId, gpu]);

  const handleScanTrigger = async (text: string) => {
    if (!text.trim()) return;
    setScanning(true);
    setScanResult(null);
    try {
      const res = await onManualScan(text);
      setScanResult(res.details || res.detection);
      setCustomInputText("");
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Plastic": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Glass": return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "Metal": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Organic": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Hazardous": return "bg-rose-100 text-rose-700 border-rose-200";
      case "E-Waste": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Get active detected item for drawing boundary box mockup
  const currentVisualDet = detections.length > 0 ? detections[0] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      
      {/* Visual Workspace: Left and Mid blocks */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Cam Vision Stream Block */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-gray-600" />
                Live Camera Source: <span className="text-gray-500 font-mono text-xs">{config.activeCameraId === "cam-1" ? "Conveyor_Beta_01" : "Campus_Recycling_Hub_04"}</span>
              </h3>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onConfigChange({ isStreamActive: !config.isStreamActive })}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${config.isStreamActive ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}
                title="Toggle Active Vision feed stream"
                id="live_camera_toggle"
              >
                {config.isStreamActive ? (
                  <><Square className="h-3.5 w-3.5" /> Stop Stream</>
                ) : (
                  <><Play className="h-3.5 w-3.5" /> Start Stream</>
                )}
              </button>

              <button
                onClick={() => onConfigChange({ conveyorRunning: !config.conveyorRunning })}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${config.conveyorRunning ? "bg-amber-50 text-amber-600 border border-amber-200 animate-pulse-slow" : "bg-gray-100 text-gray-500 border border-gray-200"}`}
                title="Simulate motor conveyor belt"
                id="live_conveyor_toggle"
              >
                <Layers className="h-3.5 w-3.5" /> Conveyor: {config.conveyorRunning ? "RUNNING" : "PAUSED"}
              </button>

              <select
                value={config.activeCameraId}
                onChange={(e) => onConfigChange({ activeCameraId: e.target.value })}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 font-sans text-[11px] font-semibold outline-none focus:border-emerald-500"
                title="Select active camera stream"
                id="live_camera_select"
              >
                <option value="cam-1">Conveyor Alpha Feed (Sorting Belt) </option>
                <option value="cam-2">Terminal Scanner Beta (Secondary Gate) </option>
              </select>
            </div>
          </div>

          {/* Interactive Bounding Box Canvas simulation */}
          <div className="relative aspect-video rounded-xl border border-gray-200 bg-slate-900 overflow-hidden flex items-center justify-center">
            
            {/* Overlay grid mesh */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-15"></div>

            {config.isStreamActive ? (
              <>
                {/* Simulated CCTV Camera Artifact lines */}
                <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-emerald-400">
                  🔴 REC | {config.activeCameraId === "cam-1" ? "BELT_INFERENCE_CUDA" : "GATE_INTELLIGENCE_NODE"}<br />
                  LATENCY: {gpu.inferenceSpeedMs}ms • CONF LIMIT: {config.detectionThreshold}
                </div>

                <div className="absolute bottom-4 left-4 z-10 font-mono text-[9px] text-gray-400">
                  COORD MATCH SYSTEM: OK (WGS84)<br />
                  HX711 SIGNAL BALANCE SECURED
                </div>

                {/* Animated Scan Line */}
                {config.conveyorRunning && (
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-500/30 shadow-[0_0_10px_2px_#10b981] animate-line-sweep z-10" style={{
                    animation: "sweep 4s linear infinite"
                  }}></div>
                )}

                {/* Drawn item coordinates & boundary overlays */}
                {currentVisualDet ? (
                  <div 
                    className="absolute border-2 rounded-lg p-2 flex flex-col justify-between"
                    style={{
                      left: `${currentVisualDet.coordinates.x % 75}%`,
                      top: `${currentVisualDet.coordinates.y % 55}%`,
                      width: "160px",
                      height: "140px",
                      borderColor: currentVisualDet.colorCode,
                      backgroundColor: `${currentVisualDet.colorCode}0F`,
                      transition: "all 0.5s ease-out"
                    }}
                  >
                    {/* Bounding box marker label */}
                    <div className="flex flex-col gap-0.5 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 text-[9px] font-mono font-bold text-white max-w-fit">
                      <span className="truncate">{currentVisualDet.item}</span>
                      <span className="text-[8px] opacity-90">{currentVisualDet.category} | {currentVisualDet.confidence}%</span>
                    </div>

                    {/* SAM2 Segment Shape Mock */}
                    <div 
                      className="absolute inset-2 rounded-full opacity-40 blur-[1px]"
                      style={{ backgroundColor: currentVisualDet.colorCode }}
                    ></div>

                    <div className="text-right">
                      <span className="font-mono text-[8px] uppercase px-1 py-0.5 bg-black/50 text-emerald-300 rounded">
                        {currentVisualDet.sensorFusionStatus}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-white text-xs font-mono">Camera active. Awaiting material stream feed on conveyor.</div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400 p-6 z-10 space-y-2">
                <Camera className="h-8 w-8 mx-auto text-gray-600 animate-pulse-slow" />
                <p className="font-sans text-xs">Visual stream is paused in settings.</p>
                <button
                  onClick={() => onConfigChange({ isStreamActive: true })}
                  className="rounded-lg bg-gray-800 text-xs px-3 py-1 font-semibold text-white hover:bg-gray-700 transition"
                >
                  Activate Video Feed
                </button>
              </div>
            )}
          </div>

          {/* Key Vision Model Hyperparameters Form Control */}
          <div className="mt-4 flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Pipeline Core Config:</span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">YOLOv11 Enterprise</span>
              <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">SAM2 High-Res</span>
            </div>
            
            <div className="flex items-center gap-3">
              <label htmlFor="iou_threshold_slider" className="font-mono text-[11px] text-gray-500">
                Confidence Threshold Limit: <span className="font-bold text-gray-800">{config.detectionThreshold}</span>
              </label>
              <input
                id="iou_threshold_slider"
                type="range"
                min="0.4"
                max="0.95"
                step="0.05"
                value={config.detectionThreshold}
                onChange={(e) => onConfigChange({ detectionThreshold: Number(e.target.value) })}
                className="h-1 w-28 cursor-pointer rounded-lg bg-gray-200 accent-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* ESP32 Server / YOLO Logs Console Terminal */}
        <div className="rounded-2xl border border-gray-150 bg-gray-950 p-5 font-mono text-xs text-emerald-400 shadow-xl shadow-gray-100/30">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3 text-gray-500 font-bold">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Terminal className="h-3.5 w-3.5 text-emerald-500" />
              <span>IOT HARDWARE CONSOLE GATEWAY</span>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-400">STREAMING LOGS</span>
          </div>
          
          <div className="space-y-1.5 h-36 overflow-y-auto font-mono text-[10px]">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="leading-relaxed hover:bg-emerald-500/5 px-1 py-0.5 rounded">
                <span className="text-emerald-600 font-semibold mr-1">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Control Workspace: Right block */}
      <div className="space-y-6">
        
        {/* Real Gemini Smart AI Sandbox Classifier Widget */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 -mr-12 -mt-12 rounded-full bg-emerald-50 blur-2xl -z-10"></div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white shadow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-gray-900">Sandbox AI Segment Classifier</h3>
              <p className="text-[10px] text-gray-400">Verify material attributes via server-side Gemini 3.5 AI</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Preset Samples to scan</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_SCAN_SAMPLES.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => handleScanTrigger(sample.text)}
                    disabled={scanning}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-white p-2.5 text-left text-[11px] font-semibold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50/40 disabled:opacity-50 transition-all"
                  >
                    <span className="text-base leading-none">{sample.icon}</span>
                    <span className="truncate">{sample.text}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label htmlFor="custom_descriptive_field" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Or write raw custom item attributes
              </label>
              
              <div className="flex gap-2">
                <input
                  id="custom_descriptive_field"
                  type="text"
                  placeholder="e.g. Broken medical vaccine flask organic dust"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  disabled={scanning}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                
                <button
                  onClick={() => handleScanTrigger(customInputText)}
                  disabled={scanning || !customInputText.trim()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-200 transition-colors"
                >
                  {scanning ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Live Result Output */}
            {scanResult && (
              <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm animate-fade-in text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <span className="font-sans font-bold text-gray-900 leading-none">AI Segment Attributes</span>
                  <span className={`rounded-full px-2 py-0.5 border text-[10px] font-semibold ${getCategoryColor(scanResult.category)}`}>
                    {scanResult.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600 leading-none border-b border-gray-50 pb-2">
                  <div>Normalized Name: <span className="font-black text-gray-900 block mt-0.5 truncate">{scanResult.item || scanResult.name}</span></div>
                  <div>Inference Confidence: <span className="font-black text-emerald-600 block mt-0.5">{scanResult.confidence}%</span></div>
                  <div>Suggested Placement: <span className="font-black text-blue-600 block mt-0.5 truncate">{scanResult.recommendedBin || scanResult.recommended_bin}</span></div>
                  <div>Circular Valuation: <span className="font-black text-amber-600 block mt-0.5">${(scanResult.estimatedValue || 0.45).toFixed(2)}/kg</span></div>
                </div>

                <div className="text-[10px] text-gray-500 leading-relaxed italic bg-emerald-50/50 p-2 rounded border border-emerald-100/20">
                  ⚡ <strong>Eco-Advantage:</strong> {scanResult.funFact}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* List of Recent Real-time Detections Stream logs */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-indigo-500" />
              Real-Time Segment Logs
            </h3>
            <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-500">
              {detections.length} total
            </span>
          </div>

          <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
            {detections.map((det) => (
              <div 
                key={det.id} 
                className="flex items-start justify-between rounded-xl border border-gray-50 bg-gray-50/40 p-3 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <div className="space-y-1 max-w-[70%]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-sans text-xs font-bold text-gray-900 truncate block decoration-indigo-200">
                      {det.item}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${getCategoryColor(det.category)}`}>
                      {det.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 font-mono text-[9px] text-gray-400">
                    <span>Scale: {det.areaPercentage}%</span>
                    <span>•</span>
                    <span>Mass: {det.weightKg}kg</span>
                    <span>•</span>
                    <span>Speed: {gpu.inferenceSpeedMs}ms</span>
                  </div>

                  <p className="text-[9px] text-gray-500 truncate" title={det.recommendedBin}>
                    ➡️ {det.recommendedBin}
                  </p>
                </div>

                {/* Sensor Fusion Tag */}
                <div className="text-right">
                  <span className="font-mono text-[9px] block text-gray-400">{new Date(det.timestamp).toLocaleTimeString()}</span>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    {det.sensorFusionStatus === "Verified" ? (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold font-mono text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100">
                        <CheckCircle2 className="h-2 w-2" /> FUSION
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[8px] font-bold font-mono text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-100">
                        <AlertTriangle className="h-2 w-2" /> MISMATCH
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
