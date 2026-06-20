import React, { useState } from "react";
import { GPUMetrics, SmartBin } from "../types";
import { 
  ShieldAlert, 
  Cpu, 
  Settings2, 
  Layers, 
  UserPlus, 
  RefreshCcw, 
  SlidersHorizontal,
  Server,
  Activity,
  Plus
} from "lucide-react";

interface AdminPanelProps {
  gpu: GPUMetrics;
  bins: SmartBin[];
}

export default function AdminPanel({ gpu, bins }: AdminPanelProps) {
  const [modelType, setModelType] = useState("yolov11-enterprise");
  const [samResolution, setSamResolution] = useState("1024x1024-polygon");
  const [coolingMode, setCoolingMode] = useState("AI-Auto-Thermal");
  const [rollbacks, setRollbacks] = useState<string[]>([]);
  const [restoring, setRestoring] = useState(false);

  // New simulated user registration form
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState("Field Operator");
  const [registeredList, setRegisteredList] = useState<Array<{ name: string; role: string }>>([
    { name: "John Doe", role: "Field Operator" },
    { name: "Chief Architect Sriram", role: "Admin" },
    { name: "Alice Glass", role: "Recycling Plant Operator" },
  ]);

  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;
    setRegisteredList((prev) => [...prev, { name: regName, role: regRole }]);
    setRegName("");
  };

  const handleModelRollback = () => {
    setRestoring(true);
    setTimeout(() => {
      setRollbacks((prev) => [`Rolled back GPU Core to weights checkpoint YAML v2.0.84 at ${new Date().toLocaleTimeString()}`, ...prev]);
      setRestoring(false);
    }, 1500);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      
      {/* Left and mid block: GPU core models hyperparameter profiles */}
      <div className="lg:col-span-2 space-y-4">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Cpu className="h-4.5 w-4.5 text-indigo-500" />
              Real-Time MLOps GPU Infrastructure & rollbacks
            </h3>
            <p className="text-[11px] text-gray-500 font-sans">Configure high-performance edge weights or rollback to stable epochs</p>
          </div>

          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 font-mono text-[9px] font-bold text-indigo-700 flex items-center gap-1">
            <Server className="h-3.5 w-3.5" /> NVIDIA CUDA: v12.4 Core
          </span>
        </div>

        {/* Hyperparameter slider matrix */}
        <div className="grid gap-4 sm:grid-cols-2">
          
          {/* Box 1: Core AI pipeline model */}
          <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm space-y-4">
            <h4 className="font-sans text-xs font-bold text-gray-950 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" /> YOLO / RT-DETR Hyperparameter Core
            </h4>

            <div className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="model_core_select" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Active Edge Model:
                </label>
                <select
                  id="model_core_select"
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value)}
                  className="w-full rounded-lg border border-gray-250 bg-white px-2.5 py-1.5 font-sans text-xs outline-none focus:border-emerald-500 font-semibold text-gray-700"
                >
                  <option value="yolov11-enterprise">YOLOv11 Master-Seg (Default)</option>
                  <option value="rt-detr-quantum">RT-DETR-Deformable (Zero-Shot Object)</option>
                  <option value="yolov10-lightweight">YOLOv10 Lightweight (Mobile Nodes)</option>
                </select>
              </div>

              <div>
                <label htmlFor="sam2_res_select" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  SAM2 Segmentation Resolution:
                </label>
                <select
                  id="sam2_res_select"
                  value={samResolution}
                  onChange={(e) => setSamResolution(e.target.value)}
                  className="w-full rounded-lg border border-gray-250 bg-white px-2.5 py-1.5 font-sans text-xs outline-none focus:border-emerald-500 font-semibold text-gray-700"
                >
                  <option value="1024x1024-polygon">1024x1024 Ultra Polygon (High VRAM)</option>
                  <option value="512x512-dense-mask">512x512 Balanced Dense Grid</option>
                  <option value="256-light-contour">256x256 Rapid Fine Contour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Box 2: GPU Active thermals & rollback controls */}
          <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm space-y-3">
            <h4 className="font-sans text-xs font-bold text-gray-950 flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-rose-500 animate-pulse-slow" /> Thermal Profile Management
            </h4>

            <div className="space-y-3.5 text-xs text-gray-500 leading-none">
              <div className="flex justify-between font-mono text-[10px]">
                <span>Active physical thermal limits:</span>
                <strong className="text-gray-900">{gpu.temperatureCelsius} °C</strong>
              </div>

              <div>
                <label htmlFor="gpu_cooling_select" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Cooling fan profile:
                </label>
                <select
                  id="gpu_cooling_select"
                  value={coolingMode}
                  onChange={(e) => setCoolingMode(e.target.value)}
                  className="w-full rounded-lg border border-gray-250 bg-white px-2.5 py-1.5 font-sans text-xs outline-none focus:border-red-500 font-semibold text-gray-600"
                >
                  <option value="AI-Auto-Thermal">AI-Auto-Thermal Optimizer</option>
                  <option value="Maximum-Manual">Liquid Fan Core High-Output</option>
                  <option value="Silent-Eco">Silent-Eco (Acoustic Low Power)</option>
                </select>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleModelRollback}
                  disabled={restoring}
                  className="w-full flex items-center justify-center gap-1 rounded-xl bg-gray-950 text-white font-bold text-xs p-2.5 hover:bg-rose-600 transition-colors"
                >
                  <RefreshCcw className={`h-3 w-3 ${restoring ? "animate-spin" : ""}`} /> Rollback to Previous Stable Weights
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Display rollbacks audit logs history is functional */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sans text-xs space-y-3">
          <h4 className="font-sans text-xs font-bold text-gray-900 flex items-center gap-1">
            <Layers className="h-4.5 w-4.5 text-indigo-500" /> Active Rollback & Weight Calibration Records
          </h4>

          <div className="space-y-2 h-28 overflow-y-auto font-mono text-[10px] text-gray-500">
            {rollbacks.length > 0 ? (
              rollbacks.map((roll, idx) => (
                <div key={idx} className="bg-emerald-50 text-emerald-800 p-2 border border-emerald-100 rounded">
                  🟢 {roll}
                </div>
              ))
            ) : (
              <p className="italic">No direct checkpoint modifications have been issued. System weights current state is optimized for YOLOv11 and RT-DETR epochs.</p>
            )}
            <div className="p-2 border border-gray-200 bg-white rounded">
              ⚪ Active Model System boot epoch: YOLO_EPOCH_150_VALIDATED successfully compiled dynamically for GPU. Core.
            </div>
          </div>
        </div>

      </div>

      {/* User Management and Sensors auditing widget */}
      <div className="space-y-6">
        
        {/* Register simulated users form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold text-gray-950 font-sans">Access Control (RBAC)</h4>
              <p className="text-[10px] text-gray-400 font-sans">Manage authorized smart city campus profiles</p>
            </div>
          </div>

          <form onSubmit={handleRegisterUser} className="space-y-3">
            <div>
              <label htmlFor="operator_id_input" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Operator Full Name:
              </label>
              <input
                id="operator_id_input"
                type="text"
                placeholder="e.g. Johnathan Cooper"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 transition-all font-semibold font-sans text-gray-700"
              />
            </div>

            <div>
              <label htmlFor="operator_rbac_select" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Authorized RBAC Role:
              </label>
              <select
                id="operator_rbac_select"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500 transition-all font-semibold font-sans text-gray-600"
              >
                <option value="Field Operator">Field Operator</option>
                <option value="Municipal Manager">Municipal Manager</option>
                <option value="Recycling Plant Operator">Recycling Plant Operator</option>
                <option value="Admin">Admin (Master Control)</option>
              </select>
            </div>

            <button
              type="submit"
              id="admin_register_user_btn"
              className="w-full flex items-center justify-center gap-1 rounded-xl bg-gray-950 font-bold p-2 text-xs text-white hover:bg-emerald-600 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Authorized Profile
            </button>
          </form>

          {/* List of registered members */}
          <div className="space-y-2 max-h-40 overflow-y-auto border-t border-gray-50 pt-3">
            {registeredList.map((user, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-2 rounded bg-gray-50 border border-gray-150">
                <span className="font-bold text-gray-800">{user.name}</span>
                <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[9px] text-indigo-700 font-bold">
                  {user.role}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
