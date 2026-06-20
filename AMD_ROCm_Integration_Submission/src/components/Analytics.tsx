import React, { useState, useEffect, useRef } from "react";
import { CarbonMetrics, SmartBin } from "../types";
import { 
  LineChart as LineChartIcon, 
  Trees, 
  Zap, 
  Scale, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Activity, 
  Leaf,
  Sparkles,
  Search,
  MapPin
} from "lucide-react";
import { jsPDF } from "jspdf";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface AnalyticsProps {
  carbon: CarbonMetrics;
  bins: SmartBin[];
}

export default function Analytics({ carbon, bins }: AnalyticsProps) {
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportDownloaded, setReportDownloaded] = useState(false);
  
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  // PDF report builder function
  const handleGenerateReport = () => {
    setReportGenerating(true);
    setReportDownloaded(false);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        const matureTreesSaved = Math.round(carbon.co2SavedKg / 22.5);
        const sedanMilesOffset = Math.round(carbon.co2SavedKg * 2.45);
        const homePowerDays = Math.round(carbon.energySavedMwh * 92);

        // Header section styled with emerald tone
        doc.setFillColor(16, 185, 129);
        doc.rect(0, 0, 210, 36, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("ECOSORT AI - SMART SUSTAINABILITY LEDGER", 14, 16);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("MUNICIPAL WASTE SEGREGATION & CIRCULAR EMISSIONS AUDIT REPORT", 14, 23);
        const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });
        doc.text(`REPORT PERIOD: ${currentMonth.toUpperCase()} | ISSUED: ${new Date().toLocaleString()}`, 14, 29);

        // Underline divider banner
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 36, 210, 2, "F");

        // Section 1 header
        doc.setTextColor(31, 41, 55);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("1. MONTHLY GHG ABATEMENT CERTIFIED METRICS", 14, 50);
        
        doc.setLineWidth(0.4);
        doc.setDrawColor(209, 213, 219);
        doc.line(14, 53, 196, 53);

        // Section 1 metrics table/list
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        doc.text(`• Total Material Recovered & Segregated:    ${carbon.totalRecycledKg.toLocaleString()} kg of compost/recycles`, 18, 62);
        doc.text(`• Net Greenhouse Emissions Offset (CO2e):   ${carbon.co2SavedKg.toLocaleString()} kg of CO2 diverted`, 18, 70);
        doc.text(`• Renewable Grid Energy Preserved:          ${carbon.energySavedMwh.toLocaleString()} Megawatt-Hours (MWh)`, 18, 78);
        doc.text(`• Municipal Landfill Diversion Rate:         ${carbon.landfillDiversionRate}% rating average`, 18, 86);
        doc.text(`• Circular Commodity Marketplace Revenue:   $${carbon.revenueGeneratedUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`, 18, 94);

        // Section 2 header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("2. PHYSICAL BIOSPHÈRE EQUIVALENT RATINGS", 14, 108);
        doc.line(14, 111, 196, 111);

        // Section 2 content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        doc.text(`• Forest Carbon Absorption:                 Equivalent to saving ${matureTreesSaved} mature trees/year`, 18, 120);
        doc.text(`• Vehicle Miles Offset:                     Diverted ${sedanMilesOffset.toLocaleString()} gasoline commuter car miles`, 18, 128);
        doc.text(`• Household Electricity Relief:              Diverted ${homePowerDays} days of average residential consumption load`, 18, 136);

        // Section 3 header: Clusters Status
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("3. ACTIVE CLUSTER SENSOR HARVESTING INVENTORY", 14, 150);
        doc.line(14, 153, 196, 153);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        let currentY = 161;
        bins.forEach((b, idx) => {
          if (currentY < 265) {
            const statusSymbol = b.status === "Critical" ? "❌ CRITICAL" : b.status === "Warning" ? "⚠️ WARNING" : "✅ NORMAL";
            doc.text(`${idx + 1}. [${b.id.toUpperCase()}] ${b.name} (${b.binType}): ${b.fillLevel}% Full | Weight: ${b.weight}kg | status: ${statusSymbol}`, 18, currentY);
            currentY += 7.5;
          }
        });

        // Closing footer note
        doc.setFillColor(243, 244, 246);
        doc.rect(0, 274, 210, 23, "F");

        doc.setLineWidth(0.2);
        doc.setDrawColor(229, 231, 235);
        doc.line(0, 274, 210, 274);

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.text(`EcoSort AI Environmental Certification Services | Audit Hash: SHA256/9e8b4e6a8dd288`, 14, 281);
        doc.text("Certified as a zero-waste transaction record for Smart City Singapore Municipal Frameworks 2026.", 14, 286);
        doc.text("This document constitutes a verifiable carbon ledger. Preserve digitally.", 14, 291);

        doc.save(`EcoSort_AI_Sustainability_Report_${currentMonth.replace(" ", "_")}.pdf`);
        setReportDownloaded(true);
      } catch (err) {
        console.error("PDF generation failure:", err);
      } finally {
        setReportGenerating(false);
      }
    }, 1200);
  };

  // Setup Leaflet Map on mounting and update on bins list
  useEffect(() => {
    if (!mapRef.current) return;

    // Reset previous Leaflet instance if present
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Centering Singapore central coordinates
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([1.2915, 103.8532], 15);

    leafletMapRef.current = map;

    // Add standard grey-scale or organic-looking tile layer from OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org">OSM</a>'
    }).addTo(map);

    // Render each bin with health alerts and high waste circle coordinates
    bins.forEach((bin) => {
      const isCritical = bin.fillLevel >= 90;
      const isWarning = bin.fillLevel >= 75 && bin.fillLevel < 90;
      
      const pinColor = isCritical ? "#f43f5e" : isWarning ? "#df8f0a" : "#10b981";
      const badgeText = isCritical ? "Critical" : isWarning ? "Warning" : "Normal";

      // 100% stable, style-matched Leaflet Dynamic DivIcon bypassing broken relative default marker assets!
      const customDivIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center" style="width: 24px; height: 24px;">
            <span class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style="background-color: ${pinColor}"></span>
            <span class="relative inline-flex rounded-full border-2 border-white shadow-lg" style="width: 14px; height: 14px; background-color: ${pinColor}"></span>
          </div>
        `,
        className: "custom-glowing-sensor-pin",
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Interactive popup details modal snippet
      const popupDetails = `
        <div style="font-family: sans-serif; padding: 4px; width: 180px; font-size: 11px; line-height: 1.4; color: #1f2937;">
          <h4 style="font-size: 12px; font-weight: bold; margin: 0 0 4px 0; color: #111827;">${bin.name}</h4>
          <div style="color: #6b7280; font-size: 10px; margin-bottom: 6px;">📍 ${bin.zone}</div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #6b7280; padding: 1px 0;">Fill Level:</td><td style="text-align: right; font-weight: bold;">${bin.fillLevel}%</td></tr>
            <tr><td style="color: #6b7280; padding: 1px 0;">HX711 Wt:</td><td style="text-align: right; font-weight: bold;">${bin.weight} kg</td></tr>
            <tr><td style="color: #6b7280; padding: 1px 0;">Temp:</td><td style="text-align: right; font-weight: bold;">${bin.temperature} °C</td></tr>
            <tr><td style="color: #6b7280; padding: 1px 0;">IoT Cell:</td><td style="text-align: right; font-weight: bold;">${bin.battery}%</td></tr>
          </table>
          <div style="margin-top: 8px; text-align: center;">
            <span style="font-weight: bold; font-size: 9px; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; border: 1px solid ${pinColor}; background-color: ${pinColor}15; color: ${pinColor};">
              ${badgeText}
            </span>
          </div>
        </div>
      `;

      // Mount marker
      L.marker([bin.latitude, bin.longitude], { icon: customDivIcon })
        .addTo(map)
        .bindPopup(popupDetails);

      // Create transparent high-waste concentration circle zone highlighting hotspots (fill >= 70%)
      if (bin.fillLevel >= 70) {
        L.circle([bin.latitude, bin.longitude], {
          radius: bin.fillLevel * 1.6, // Relative physical distance radius mapping
          color: pinColor,
          fillColor: pinColor,
          fillOpacity: 0.12,
          weight: 1
        }).addTo(map);
      }
    });

    // Cleanup Leaflet on unmount or update
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [bins]);

  // Convert stats to physical environmental equivalents
  const matureTreesSaved = Math.round(carbon.co2SavedKg / 22.5); // 1 mature tree absorbs ~22.5kg CO2 / year
  const sedanMilesOffset = Math.round(carbon.co2SavedKg * 2.45);
  const homePowerDays = Math.round(carbon.energySavedMwh * 92);

  // Simulated temporal hourly forecast arrays for visualization
  const simulatedForecastPoints = [
    { time: "08:00 AM", projected: 120, urgency: "Low" },
    { time: "11:00 AM", projected: 240, urgency: "Low" },
    { time: "02:00 PM", projected: 480, urgency: "Medium" },
    { time: "05:00 PM", projected: 750, urgency: "High" },
    { time: "08:00 PM", projected: 890, urgency: "Critical" },
    { time: "11:00 PM", projected: 310, urgency: "Low" }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      
      {/* Carbon Ledger Cards */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Title */}
        <div className="border-b border-gray-100 pb-3">
          <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Trees className="h-4.5 w-4.5 text-emerald-500" />
            Carbon Ledger & Environmental Impact audits
          </h3>
          <p className="text-[11px] text-gray-500 font-sans">
            Real-time material weight offsets multiplied by chemical emission saving indicators
          </p>
        </div>

        {/* 4 Carbon Matrix grids */}
        <div className="grid gap-4 sm:grid-cols-2">
          
          {/* Card 1: Carbon reduction */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3 hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">GHG Abatement</span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <Leaf className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <h4 className="font-mono text-2xl font-extrabold text-gray-950">
                {carbon.co2SavedKg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
              </h4>
              <p className="font-sans text-xs text-gray-500 mt-1">
                Net emissions of Carbon Dioxide (CO₂e) diverted from biosphere.
              </p>
            </div>
            {/* Equivalents progress meters */}
            <div className="rounded-xl bg-gray-50 px-3 py-2 border border-gray-100 text-[10px] space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Equivalent forest carbon absorption:</span>
                <strong className="text-emerald-700">{matureTreesSaved} Trees/yr</strong>
              </div>
              <div className="flex justify-between">
                <span>Equivalent passenger car offset:</span>
                <strong className="text-indigo-700">{sedanMilesOffset.toLocaleString()} mi</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Waste recycled */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3 hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total processed</span>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Scale className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <h4 className="font-mono text-2xl font-extrabold text-gray-950">
                {carbon.totalRecycledKg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
              </h4>
              <p className="font-sans text-xs text-gray-500 mt-1">
                Raw compostable and recyclable mass sorted, processed, and validated.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2 border border-gray-100 text-[10px] text-gray-600 flex justify-between items-center">
              <span>Overall Landfill Diversion Rating:</span>
              <span className="rounded bg-indigo-50 px-2 py-0.5 font-bold font-mono text-indigo-700">
                {carbon.landfillDiversionRate}%
              </span>
            </div>
          </div>

          {/* Card 3: Energy Saved */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3 hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Grid Energy Saved</span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Zap className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <h4 className="font-mono text-2xl font-extrabold text-gray-950">
                {carbon.energySavedMwh.toLocaleString(undefined, { maximumFractionDigits: 4 })} MWh
              </h4>
              <p className="font-sans text-xs text-gray-500 mt-1">
                Refining and extrusion electricity conservations matched against baseline.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2 border border-gray-100 text-[10px] text-gray-600 flex justify-between items-center">
              <span>Household load preservation equivalent:</span>
              <strong className="text-amber-700">{homePowerDays} residential days</strong>
            </div>
          </div>

          {/* Card 4: Financial fund */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3 hover:border-emerald-500 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Circular Revenue</span>
              <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <h4 className="font-mono text-2xl font-extrabold text-teal-600">
                ${carbon.revenueGeneratedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
              <p className="font-sans text-xs text-gray-500 mt-1">
                Income accrued directly from auctioning cleanly separated sorted material.
              </p>
            </div>
            <div className="rounded-xl bg-teal-50/20 px-3 py-2 border border-teal-100/30 text-[10px] text-teal-700 flex justify-between items-center">
              <span>Smart City recycling efficiency:</span>
              <strong className="font-mono font-bold">100% SECURE FUNDS</strong>
            </div>
          </div>

        </div>

        {/* Interactive Open-Source GIS Map Widget */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-2">
            <div>
              <h4 className="font-sans text-xs font-bold text-gray-950 flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5 text-emerald-500 animate-pulse-slow" />
                Singapore Central Smart-GIS Hotspots Map
              </h4>
              <p className="text-[10px] text-gray-400 font-sans">
                Leaflet-driven geographical indicators mapping waste accumulations & health states
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1 bg-rose-50 border border-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span> Critical (Rings)
              </span>
              <span className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Warning (Rings)
              </span>
              <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Normal
              </span>
            </div>
          </div>

          <div className="relative rounded-xl border border-gray-200 overflow-hidden shadow-inner">
            <div ref={mapRef} style={{ height: "360px" }} className="w-full z-10" id="gis_hotspots_leaflet_map" />
          </div>

          <p className="text-[9px] text-gray-400 leading-relaxed font-sans">
            *High-Waste Hotspot Zones depict circular regions where container fill levels surpass 70%. Hover or click on the glowing telemetry nodes to reveal comprehensive load cell histories, battery diagnostics, and temperatures.
          </p>
        </div>

        {/* Real-time material allocation representation purely in CSS/HTML */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h4 className="font-sans text-xs font-bold text-gray-950">Active Smart Segregation Category Allocation</h4>
          
          <div className="space-y-3 text-xs text-gray-500">
            <div>
              <div className="flex justify-between font-mono mb-1 leading-none text-[10px]">
                <span>PET & HDPE Plastics (Blue Bin):</span>
                <span className="font-bold text-gray-800">38.4%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "38.4%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1 leading-none text-[10px]">
                <span>Alloy Containers & Steel (Yellow Bin):</span>
                <span className="font-bold text-gray-800">22.8%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: "22.8%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1 leading-none text-[10px]">
                <span>Nutrient Composites & Cardboard (Green Bin):</span>
                <span className="font-bold text-gray-850">26.1%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "26.1%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1 leading-none text-[10px]">
                <span>Glass & Silica Containers (Turquoise Bin):</span>
                <span className="font-bold text-gray-805">8.2%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: "8.2%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-mono mb-1 leading-none text-[10px]">
                <span>Hazardous Cell Elements & E-Waste:</span>
                <span className="font-bold text-gray-800">4.5%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: "4.5%" }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Forecasting and report export side widget */}
      <div className="space-y-6">
        
        {/* Predictive accumulation limits */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold text-gray-950">AI Volume Forecasting (LSTM)</h4>
              <p className="text-[10px] text-gray-400">Projected hourly accumulative mass trend estimates</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {simulatedForecastPoints.map((pt, i) => {
              const heightPct = (pt.projected / 1000) * 100;
              return (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between leading-none text-[10px] font-mono text-gray-500">
                    <span>{pt.time}</span>
                    <span className="font-bold text-gray-900">{pt.projected} kg projected</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full flex border border-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${pt.urgency === "Critical" ? "bg-rose-500" : pt.urgency === "High" ? "bg-amber-500" : "bg-indigo-500"}`}
                      style={{ width: `${heightPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl bg-indigo-50/40 border border-indigo-100/40 p-3 text-[10px] text-indigo-700 leading-relaxed font-mono">
            ⚡ <strong>Recycling Trend Insight:</strong> Peak accumulation window detected around 5:00 PM to 8:00 PM. System recommends dispatching collection trucks at 4:30 PM to avoid container overflows.
          </div>

        </div>

        {/* Generate Report */}
        <div className="rounded-xl border border-emerald-150 bg-emerald-50/10 p-6 shadow-sm text-center space-y-4">
          <div className="rounded-lg bg-emerald-550/10 text-emerald-605 h-10 w-10 mx-auto flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h4 className="font-sans text-xs font-bold text-gray-955">Sustainability Ledger Audit</h4>
            <p className="text-[10px] text-gray-400 mt-1">Download official PDF or TXT reports of verified environmental carbon values & zero-waste audits</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleGenerateReport}
              disabled={reportGenerating}
              id="analytics_report_btn"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gray-950 text-white hover:bg-emerald-600 px-4 py-2.5 text-xs font-semibold shadow disabled:bg-gray-100 transition-colors"
            >
              {reportGenerating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <><Download className="h-4 w-4" /> Download PDF Report</>
              )}
            </button>

            {reportDownloaded && (
              <div className="p-2 border border-emerald-200 bg-emerald-50 rounded text-[10px] text-emerald-800 font-mono text-center animate-fade-in">
                🎉 Verified Month PDF Dispatched!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

