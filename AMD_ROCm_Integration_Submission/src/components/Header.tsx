import React from "react";
import { UserRole, GPUMetrics, CarbonMetrics, Alert } from "../types";
import { 
  Building2, 
  Cpu, 
  Leaf, 
  Bell, 
  Database,
  Radio, 
  ShieldAlert, 
  UserSquare2 
} from "lucide-react";

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  gpu: GPUMetrics;
  carbon: CarbonMetrics;
  alerts: Alert[];
  onTriggerAlertsModal: () => void;
}

export default function Header({
  activeRole,
  onRoleChange,
  gpu,
  carbon,
  alerts,
  onTriggerAlertsModal
}: HeaderProps) {
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo and Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-100">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans text-lg font-bold tracking-tight text-gray-900">
                EcoSort <span className="text-emerald-500">AI</span>
              </h1>
              <span className="hidden rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 sm:inline-block">
                v2.1 Enterprise
              </span>
            </div>
            <p className="hidden font-sans text-[11px] font-medium text-gray-500 md:block">
              Smart Segregation & Circular Economy Platform
            </p>
          </div>
        </div>

        {/* Telemetry Gateways & Real-Time Carbon Tally */}
        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
            <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse-slow" />
            <span className="font-mono text-[11px] font-medium text-gray-600">
              ESP32 GW: <span className="text-emerald-600 font-bold">ONLINE</span>
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
            <Cpu className="h-3.5 w-3.5 text-indigo-500" />
            <span className="font-mono text-[11px] font-medium text-gray-600">
              GPU Engine: <span className="text-indigo-600 font-bold">{gpu.gpuUtilization}%</span>
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-emerald-50/60 px-3 py-1.5 border border-emerald-100/50">
            <Building2 className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-mono text-[11px] font-medium text-gray-700">
              CO₂ Offset: <span className="text-teal-700 font-bold">{(carbon.co2SavedKg / 1000).toFixed(2)}t</span>
            </span>
          </div>
        </div>

        {/* Alerts and Role Switcher */}
        <div className="flex items-center gap-4">
          
          {/* Active Alerts Panel Toggle Button */}
          <button
            onClick={onTriggerAlertsModal}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            title="View Active Notifications"
            id="btn_alerts_toggle"
          >
            <Bell className="h-4 w-4" />
            {unacknowledgedAlerts.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white animate-bounce">
                {unacknowledgedAlerts.length}
              </span>
            )}
          </button>

          {/* User Role Quick Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl bg-gray-50 p-1 border border-gray-200">
            <div className="hidden px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:block">
              Profile:
            </div>
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="rounded-lg bg-white px-2.5 py-1 font-sans text-xs font-semibold text-gray-700 border border-gray-200 shadow-sm outline-none focus:border-emerald-500 transition-colors"
              title="Switch user role scope"
              id="role_switcher_select"
            >
              <option value="Municipal Manager">Municipal Manager</option>
              <option value="Field Operator">Field Operator</option>
              <option value="Recycling Plant Operator">Recycling Plant Operator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
        </div>

      </div>
    </header>
  );
}
