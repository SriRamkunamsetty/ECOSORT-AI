import React, { useState } from "react";
import { CollectionRoute, SmartBin } from "../types";
import { 
  Navigation, 
  Trash2, 
  ShieldAlert, 
  Play, 
  MapPin, 
  CheckCircle2, 
  TrendingDown, 
  Gauge, 
  RefreshCcw,
  Zap
} from "lucide-react";

interface RoutingProps {
  routes: CollectionRoute[];
  bins: SmartBin[];
  onTriggerOptimization: () => Promise<any>;
}

export default function Routing({ routes, bins, onTriggerOptimization }: RoutingProps) {
  const [optimizing, setOptimizing] = useState(false);
  const [optimizerFeedback, setOptimizerFeedback] = useState<string | null>(null);

  const handleRecalculateRoutes = async () => {
    setOptimizing(true);
    setOptimizerFeedback(null);
    try {
      const res = await onTriggerOptimization();
      const newRoute = res.optimizedRoute;
      const count = newRoute.stops.length;
      
      setOptimizerFeedback(`Route Optimization Complete! Assigned active carrier ${newRoute.truckId} to service ${count} high-accumulation bins. Net fuel economy maximized with a savings of ${newRoute.estimatedFuelSavedLitres} Litres.`);
    } catch (err) {
      console.error(err);
      setOptimizerFeedback("Failure connecting to Graph Optimization service on port 3000.");
    } finally {
      setOptimizing(false);
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "text-amber-500 bg-amber-500/10";
      case "Completed": return "text-emerald-500 bg-emerald-500/10";
      default: return "text-indigo-500 bg-indigo-500/10";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      
      {/* Route List and targeted metrics */}
      <div className="lg:col-span-2 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Navigation className="h-4.5 w-4.5 text-emerald-500 animate-pulse-slow" />
              Graph Fleet Route Schedule
            </h3>
            <p className="text-[11px] text-gray-500 font-sans">
              Optimized collector itineraries based on ultrasonic levels and vehicle weight capacity
            </p>
          </div>

          <button
            onClick={handleRecalculateRoutes}
            disabled={optimizing}
            id="routing_recalc_btn"
            className="flex items-center gap-1.5 rounded-xl bg-gray-950 font-sans text-xs font-bold text-white hover:bg-emerald-600 px-4 py-2 disabled:bg-gray-200 transition-all shadow shadow-gray-100"
          >
            {optimizing ? (
              <>
                <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> Resolving TSP graph nodes...
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" /> Re-trigger Route AI Optimize
              </>
            )}
          </button>
        </div>

        {optimizerFeedback && (
          <div className="rounded-2xl bg-teal-50/50 border border-teal-100 p-4 font-mono text-[11px] text-teal-800 leading-relaxed shadow-sm animate-fade-in">
            🚀 <strong>Graph Optimizer Feed:</strong> {optimizerFeedback}
          </div>
        )}

        <div className="space-y-4">
          {routes.map((route) => (
            <div 
              key={route.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 hover:border-emerald-500 hover:shadow-md transition-all space-y-4 shadow-sm"
            >
              
              {/* Route header details */}
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 font-mono text-[11px] font-extrabold border border-gray-200/50">
                    🚚
                  </div>
                  <div>
                    <h4 className="font-sans text-xs font-bold text-gray-950 flex items-center gap-1.5">
                      {route.truckId}
                      <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${getPriorityStyle(route.priority)} border`}>
                        {route.priority} Priority
                      </span>
                    </h4>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5">Assigned to: <strong className="text-gray-600">{route.driverName}</strong></p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold font-mono uppercase ${getStatusColor(route.status)}`}>
                    {route.status}
                  </span>
                  <span className="font-sans text-[10px] text-gray-400 font-semibold">ID: {route.id}</span>
                </div>
              </div>

              {/* Dynamic stops sequence flow bar */}
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-2">Stops sequence profile:</p>
                <div className="flex flex-wrap items-center gap-2">
                  {route.stops.map((stopId, idx) => {
                    const binObj = bins.find(b => b.id === stopId);
                    return (
                      <React.Fragment key={stopId}>
                        <div className="rounded-xl border border-gray-150 bg-gray-50 p-2.5 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                          <div className="text-[10px] font-sans">
                            <span className="block font-bold text-gray-900 truncate max-w-[120px]">{binObj ? binObj.name : stopId}</span>
                            <span className="block text-gray-400 text-[9px] font-mono mt-0.5">Fill limit: {binObj ? `${binObj.fillLevel}%` : "Pending"}</span>
                          </div>
                        </div>
                        {idx < route.stops.length - 1 && (
                          <span className="text-gray-300 font-bold font-mono text-xs">➔</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Stats of savings */}
              <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3 text-center font-mono text-[10px]">
                
                <div className="bg-emerald-50/20 rounded border border-emerald-100/30 p-2 text-emerald-700">
                  <span className="block text-[8px] uppercase tracking-wider text-emerald-500">Fuel Conserved</span>
                  <strong className="block text-xs font-extrabold mt-0.5">{route.estimatedFuelSavedLitres} Litres</strong>
                </div>

                <div className="bg-indigo-50/20 rounded border border-indigo-100/30 p-2 text-indigo-700">
                  <span className="block text-[8px] uppercase tracking-wider text-indigo-500">CO2 Equivalent Saved</span>
                  <strong className="block text-xs font-extrabold mt-0.5">{route.carbonReductionKg} kg</strong>
                </div>

                <div className="bg-gray-50 rounded border border-gray-150 p-2 text-gray-700">
                  <span className="block text-[8px] uppercase tracking-wider text-gray-400">Net distance</span>
                  <strong className="block text-xs font-extrabold mt-0.5">{route.totalDistanceKm} km</strong>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Map visualizer side widget representing layout coordinates */}
      <div className="space-y-6">
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Gauge className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold text-gray-950">Active Transit Topology GIS</h4>
              <p className="text-[10px] text-gray-400">Coordinated node coordinates mapping (Singapore Central)</p>
            </div>
          </div>

          {/* Canvas or visual map mock */}
          <div className="relative h-64 rounded-xl border border-gray-200 bg-slate-50 overflow-hidden flex items-center justify-center">
            
            {/* Custom SVG Drawing map network */}
            <svg className="absolute inset-0 h-full w-full opacity-60 z-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></svg>

            {/* Custom line sequence drawings representing actual polylines from raw data */}
            <svg className="absolute inset-0 h-full w-full z-10">
              {routes.map((route, i) => {
                // Map mock lat longs to raw SVG coordinates
                const points = route.polyline.map(([lat, lng]) => {
                  const x = (lng - 103.8490) * 8000 + 40;
                  const y = (1.2950 - lat) * 8000 + 40;
                  return `${x},${y}`;
                }).join(" ");

                return (
                  <polyline 
                    key={route.id}
                    points={points}
                    fill="none"
                    stroke={i === 0 ? "#10b981" : "#4f46e5"}
                    strokeWidth="3.5"
                    strokeDasharray={i > 0 ? "5,5" : undefined}
                  />
                );
              })}
            </svg>

            {/* Marker Nodes */}
            <div className="absolute z-20 inset-0 pointer-events-none">
              {bins.map((bin) => {
                const x = (bin.longitude - 103.8490) * 8000 + 40;
                const y = (1.2950 - bin.latitude) * 8000 + 40;
                const isUrgent = bin.status !== "Normal";

                return (
                  <div 
                    key={bin.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${x}px`, top: `${y}px` }}
                  >
                    <span className={`inline-block h-3.5 w-3.5 rounded-full border bg-white shadow ${isUrgent ? "border-rose-500 ring-4 ring-rose-500/25 block" : "border-slate-500"}`}></span>
                    <span className="bg-black/80 font-mono text-[7px] text-white px-1 rounded absolute top-4 truncate max-w-[60px]">
                      {bin.binType}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-3 left-3 z-30 flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-wide bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-lg border shadow-sm">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 block"></span> Active path
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500 block animate-pulse"></span> Urgent Bins
              </div>
            </div>

          </div>

          <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
            *Map routes are calculated dynamically using the <strong>A* pathfinder heuristic</strong>. The algorithms evaluate live bin weights and prioritize locations nearing maximum physical volume threshold constraints first.
          </p>

        </div>

      </div>

    </div>
  );
}
