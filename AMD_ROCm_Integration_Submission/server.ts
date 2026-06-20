import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent set for telemetry according to guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Successfully initialized Gemini API Client.");
  } catch (err) {
    console.error("Gemini Clients init failed:", err);
  }
} else {
  console.log("No GEMINI_API_KEY detected. Using secondary smart analysis algorithm.");
}

// Import Types
import { SystemState, WasteDetection, SmartBin, CollectionRoute, MarketplaceAuction, Alert, GPUMetrics, UserRole } from "./src/types";

// Global In-Memory Smart City & Campus Segregation State
let centralState: SystemState = {
  detections: [
    {
      id: "det-1",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      item: "Crushed Polyethylene Bottle",
      category: "Plastic" as const,
      confidence: 94.8,
      areaPercentage: 12.4,
      weightKg: 0.045,
      colorCode: "#3b82f6", // Blue Bin
      recommendedBin: "Blue Storage Bin (Plastics)",
      coordinates: { x: 120, y: 80, w: 90, h: 180 },
      sensorFusionStatus: "Verified" as const,
      location: "Conveyor Belt Stream Alpha",
      processed: true,
    },
    {
      id: "det-2",
      timestamp: new Date(Date.now() - 2500000).toISOString(),
      item: "Borosilicate Chemical Beaker (Broken)",
      category: "Hazardous" as const,
      confidence: 89.2,
      areaPercentage: 8.9,
      weightKg: 0.18,
      colorCode: "#ef4444", // Red Bin
      recommendedBin: "Red Container Bin (Hazardous)",
      coordinates: { x: 340, y: 150, w: 100, h: 120 },
      sensorFusionStatus: "Verified" as const,
      location: "Hospital Wing Stream Beta",
      processed: true,
    },
    {
      id: "det-3",
      timestamp: new Date(Date.now() - 1500000).toISOString(),
      item: "Kraft Solder Cardboard Box",
      category: "Organic" as const,
      confidence: 91.5,
      areaPercentage: 24.5,
      weightKg: 0.42,
      colorCode: "#22c55e", // Green Bin
      recommendedBin: "Green Compost Bin (Compostables)",
      coordinates: { x: 50, y: 210, w: 220, h: 150 },
      sensorFusionStatus: "Verified" as const,
      location: "Conveyor Belt Stream Alpha",
      processed: true,
    },
    {
      id: "det-4",
      timestamp: new Date(Date.now() - 500000).toISOString(),
      item: "Lithium-Ion AA Battery Pack",
      category: "Hazardous" as const,
      confidence: 97.1,
      areaPercentage: 3.1,
      weightKg: 0.09,
      colorCode: "#ef4444", // Red Bin
      recommendedBin: "Red Container Bin (Hazardous)",
      coordinates: { x: 450, y: 50, w: 40, h: 60 },
      sensorFusionStatus: "Verified" as const,
      location: "Terminal 2 Bin Scanner",
      processed: true,
    },
  ],
  bins: [
    {
      id: "bin-1",
      name: "Smart Bin - Sector A (Plastics)",
      zone: "Municipal Zone A - Terminal Core",
      latitude: 1.2902,
      longitude: 103.8519,
      binType: "Plastic" as const,
      fillLevel: 82.5,
      weight: 18.4,
      temperature: 28.5,
      overflowPredictedHours: 3.2,
      lastReported: new Date().toISOString(),
      battery: 91,
      status: "Warning" as const,
      iotConnected: true,
    },
    {
      id: "bin-2",
      name: "Smart Bin - Sector A (Hazardous)",
      zone: "Municipal Zone A - Clinical Ward",
      latitude: 1.2915,
      longitude: 103.8532,
      binType: "Hazardous" as const,
      fillLevel: 94.1,
      weight: 35.8,
      temperature: 31.0,
      overflowPredictedHours: 1.5,
      lastReported: new Date().toISOString(),
      battery: 88,
      status: "Critical" as const,
      iotConnected: true,
    },
    {
      id: "bin-3",
      name: "Smart Bin - Sector B (Compost)",
      zone: "Municipal Zone B - Campus Canteen",
      latitude: 1.2885,
      longitude: 103.8495,
      binType: "Organic" as const,
      fillLevel: 45.0,
      weight: 12.2,
      temperature: 34.2,
      overflowPredictedHours: 24.5,
      lastReported: new Date().toISOString(),
      battery: 95,
      status: "Normal" as const,
      iotConnected: true,
    },
    {
      id: "bin-4",
      name: "Smart Bin - Sector B (Metal Cans)",
      zone: "Municipal Zone B - Central Canopy",
      latitude: 1.2892,
      longitude: 103.8502,
      binType: "Metal" as const,
      fillLevel: 78.4,
      weight: 22.1,
      temperature: 26.8,
      overflowPredictedHours: 6.8,
      lastReported: new Date().toISOString(),
      battery: 79,
      status: "Warning" as const,
      iotConnected: true,
    },
    {
      id: "bin-5",
      name: "Smart Bin - Sector C (E-Waste Gate)",
      zone: "Municipal Zone C - Tech Atrium",
      latitude: 1.2930,
      longitude: 103.8550,
      binType: "E-Waste" as const,
      fillLevel: 28.0,
      weight: 8.5,
      temperature: 24.2,
      overflowPredictedHours: 72.0,
      lastReported: new Date().toISOString(),
      battery: 100,
      status: "Normal" as const,
      iotConnected: true,
    },
    {
      id: "bin-6",
      name: "Smart Bin - Sector D (Glass Depository)",
      zone: "Municipal Zone D - Pub Avenue",
      latitude: 1.2945,
      longitude: 103.8568,
      binType: "Glass" as const,
      fillLevel: 89.0,
      weight: 41.2,
      temperature: 25.1,
      overflowPredictedHours: 2.8,
      lastReported: new Date().toISOString(),
      battery: 84,
      status: "Warning" as const,
      iotConnected: true,
    },
  ],
  routes: [
    {
      id: "route-101",
      truckId: "TRUCK-A-4139",
      driverName: "Marcus Cooper",
      priority: "High" as const,
      status: "In Progress" as const,
      currentLocation: { lat: 1.2895, lng: 103.8500 },
      stops: ["bin-2", "bin-1", "bin-6"],
      estimatedFuelSavedLitres: 14.8,
      carbonReductionKg: 38.5,
      totalDistanceKm: 18.2,
      polyline: [
        [1.2895, 103.8500],
        [1.2902, 103.8519],
        [1.2915, 103.8532],
        [1.2945, 103.8568],
      ] as Array<[number, number]>,
    },
    {
      id: "route-102",
      truckId: "TRUCK-B-9981",
      driverName: "Sarah Jenkins",
      priority: "Medium" as const,
      status: "Assigned" as const,
      currentLocation: { lat: 1.2885, lng: 103.8495 },
      stops: ["bin-4", "bin-3"],
      estimatedFuelSavedLitres: 6.2,
      carbonReductionKg: 16.1,
      totalDistanceKm: 9.4,
      polyline: [
        [1.2885, 103.8495],
        [1.2892, 103.8502],
      ] as Array<[number, number]>,
    },
  ],
  auctions: [
    {
      id: "auc-1",
      title: "Sorted Post-Consumer Polyethylene Terephthalate Flakes",
      category: "Plastic" as const,
      quantityKg: 1200,
      estimatedValueUsd: 480.0,
      currentBidUsd: 410.0,
      status: "Open" as const,
      listedDate: new Date(Date.now() - 48 * 3600000).toISOString(),
      bids: [
        { id: "bid-1", recyclerName: "Pioneer Polymers Industries", bidAmount: 380, reputation: 4.8 },
        { id: "bid-2", recyclerName: "GreenTech Cycle Corp", bidAmount: 410, reputation: 4.5 },
      ],
    },
    {
      id: "auc-2",
      title: "Prismatic Automotive Aluminum Can Shreds",
      category: "Metal" as const,
      quantityKg: 850,
      estimatedValueUsd: 1105.0,
      currentBidUsd: 1105.0,
      status: "Sold" as const,
      listedDate: new Date(Date.now() - 72 * 3600000).toISOString(),
      bids: [
        { id: "bid-3", recyclerName: "Apex Solder Foundry", bidAmount: 1105, reputation: 4.9 },
      ],
      salesPrice: 1105,
      buyerName: "Apex Solder Foundry",
    },
    {
      id: "auc-3",
      title: "Cullet Silica Glass Crushed Fragments",
      category: "Glass" as const,
      quantityKg: 2100,
      estimatedValueUsd: 315.0,
      currentBidUsd: 280.0,
      status: "Open" as const,
      listedDate: new Date(Date.now() - 12 * 3600000).toISOString(),
      bids: [
        { id: "bid-4", recyclerName: "GlassCorp Environmental Ltd", bidAmount: 280, reputation: 4.2 },
      ],
    },
  ],
  carbon: {
    totalRecycledKg: 78540,
    co2SavedKg: 122480,
    landfillDiversionRate: 84.6,
    energySavedMwh: 128.5,
    revenueGeneratedUsd: 14240.0,
  },
  alerts: [
    {
      id: "al-1",
      timestamp: new Date().toISOString(),
      source: "Smart Bin - Sector A (Hazardous)",
      severity: "Critical" as const,
      message: "Fill Level has reached 94.1%. High critical overflow hazard within 1.5 hours.",
      acknowledged: false,
    },
    {
      id: "al-2",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      source: "Conveyor Belt Stream Alpha",
      severity: "Warning" as const,
      message: "Metal object detected in Organic Sorting Line. Sensor Fusion marked Mismatched.",
      acknowledged: false,
    },
  ],
  gpu: {
    gpuUtilization: 78.4,
    vramTotalMb: 16384,
    vramUsedMb: 12850,
    temperatureCelsius: 64.2,
    activeStreamsCount: 4,
    inferenceSpeedMs: 14.5,
  },
  activeRole: "Municipal Manager" as const,
  detectionThreshold: 0.65,
  isStreamActive: true,
  conveyorRunning: true,
  activeCameraId: "cam-1",
};

// Simulated Waste Generator Data (used when conveying or simulating live feeds)
const simulatedItemsList = [
  { item: "PET Carbonated Soda Bottle", category: "Plastic" as const, confidence: 98.2, recBin: "Blue Storage Bin (Plastics)", color: "#3b82f6", weight: 0.035 },
  { item: "Corrugated Cardboard Box", category: "Organic" as const, confidence: 92.5, recBin: "Green Compost Bin (Compostables)", color: "#22c55e", weight: 0.35 },
  { item: "Stainless Steel Beverage Can", category: "Metal" as const, confidence: 96.1, recBin: "Yellow Storage Bin (Metals)", color: "#eab308", weight: 0.085 },
  { item: "Empty Amber Beer Glass Bottle", category: "Glass" as const, confidence: 95.4, recBin: "Turquoise Bin (Glass)", color: "#06b6d4", weight: 0.25 },
  { item: "Spent Alkaline Household Battery", category: "Hazardous" as const, confidence: 91.0, recBin: "Red Container Bin (Hazardous)", color: "#ef4444", weight: 0.05 },
  { item: "Discarded Mobile Phone Motherboard", category: "E-Waste" as const, confidence: 96.8, recBin: "Purple Tech Bin (E-Waste)", color: "#a855f7", weight: 0.12 },
  { item: "Organic Apple Core & Peelings", category: "Organic" as const, confidence: 99.1, recBin: "Green Compost Bin (Compostables)", color: "#22c55e", weight: 0.15 },
  { item: "HDPE Chemical Detergent Bottle", category: "Plastic" as const, confidence: 94.0, recBin: "Blue Storage Bin (Plastics)", color: "#3b82f6", weight: 0.088 },
];

// Live Tick Loop (every 3 seconds) to update levels, move routing trucks, generate bids, and stream new detections
setInterval(() => {
  // 1. Simulate Smart Bin Fill Levels & weights increasing randomly over time
  centralState.bins = centralState.bins.map((bin) => {
    // Random increment based on usage profile
    let fillDelta = 0;
    if (bin.binType === "Organic") fillDelta = Math.random() * 0.8;
    else fillDelta = Math.random() * 0.4;

    const newFill = Math.min(100, Math.round((bin.fillLevel + fillDelta) * 10) / 10);
    const newWeight = Math.round((bin.weight + (fillDelta * 0.25)) * 10) / 10;
    const newTemp = Math.round((bin.temperature + (Math.random() * 0.2 - 0.1)) * 10) / 10;
    
    // Status transition
    let status: "Normal" | "Warning" | "Critical" = "Normal";
    if (newFill >= 90) {
      status = "Critical";
    } else if (newFill >= 75) {
      status = "Warning";
    }

    // Generate real-time alert on critical overflow transitions
    if (status === "Critical" && bin.status !== "Critical") {
      const alertId = "al-" + Date.now();
      centralState.alerts.unshift({
        id: alertId,
        timestamp: new Date().toISOString(),
        source: bin.name,
        severity: "Critical",
        message: `${bin.name} in ${bin.zone} has exceeded 90% fill limit. Hazardous warning.`,
        acknowledged: false,
      });
    }

    return {
      ...bin,
      fillLevel: newFill,
      weight: newWeight,
      temperature: newTemp,
      status,
      lastReported: new Date().toISOString(),
    };
  });

  // 2. Continuous conveyor belt visual scan simulation (YOLOv11 & SAM2)
  if (centralState.conveyorRunning && centralState.isStreamActive) {
    // Simulate real-time waste classification flowing through the conveyor belt
    if (Math.random() > 0.4) {
      const chosenSample = simulatedItemsList[Math.floor(Math.random() * simulatedItemsList.length)];
      
      // Match weight load cell HX711 sensor confirmation
      const realWeightDeviation = (Math.random() * 0.04 - 0.02) + chosenSample.weight;
      const sensorFusionMatched = Math.random() > 0.1 ? "Verified" : "Mismatched";

      const newDet = {
        id: "det-" + Date.now(),
        timestamp: new Date().toISOString(),
        item: chosenSample.item,
        category: chosenSample.category,
        confidence: Number((chosenSample.confidence + (Math.random() * 2 - 1)).toFixed(1)),
        areaPercentage: Number((10 + Math.random() * 15).toFixed(1)),
        weightKg: Number(Math.max(0.01, realWeightDeviation).toFixed(3)),
        colorCode: chosenSample.color,
        recommendedBin: chosenSample.recBin,
        coordinates: {
          x: Math.floor(40 + Math.random() * 400),
          y: Math.floor(30 + Math.random() * 200),
          w: Math.floor(60 + Math.random() * 100),
          h: Math.floor(60 + Math.random() * 120),
        },
        sensorFusionStatus: sensorFusionMatched as "Verified" | "Mismatched",
        location: centralState.activeCameraId === "cam-1" ? "Conveyor Belt Stream Alpha" : "Terminal 2 Bin Scanner",
        processed: Math.random() > 0.25, // Classified, and piston sorted
      };

      // Add to detections
      centralState.detections.unshift(newDet);
      if (centralState.detections.length > 50) {
        centralState.detections.pop();
      }

      // Update Carbon Ledger instantly
      if (newDet.processed) {
        let co2SavedFactor = 1.25; // per kg saved
        if (newDet.category === "Plastic") co2SavedFactor = 1.5;
        else if (newDet.category === "Metal") co2SavedFactor = 4.2;
        else if (newDet.category === "Glass") co2SavedFactor = 0.9;

        centralState.carbon = {
          totalRecycledKg: Number((centralState.carbon.totalRecycledKg + newDet.weightKg).toFixed(1)),
          co2SavedKg: Number((centralState.carbon.co2SavedKg + (newDet.weightKg * co2SavedFactor)).toFixed(1)),
          revenueGeneratedUsd: Number((centralState.carbon.revenueGeneratedUsd + (newDet.weightKg * 0.35)).toFixed(2)),
          energySavedMwh: Number((centralState.carbon.energySavedMwh + (newDet.weightKg * 0.002)).toFixed(4)),
          landfillDiversionRate: Number(Math.min(99.4, centralState.carbon.landfillDiversionRate + 0.001).toFixed(2)),
        };
      }
    }
  }

  // 3. Move active collection trucks slightly on GPS coordinates
  centralState.routes = centralState.routes.map((route) => {
    if (route.status === "In Progress") {
      let lat = route.currentLocation.lat;
      let lng = route.currentLocation.lng;

      // Small steps towards next bin destinations
      lat += (Math.random() * 0.0006 - 0.0003);
      lng += (Math.random() * 0.0006 - 0.0003);

      return {
        ...route,
        currentLocation: { lat, lng },
      };
    }
    return route;
  });

  // 4. Simulate active Recycler bids on Circular Economy Marketplace auctions
  centralState.auctions = centralState.auctions.map((auction) => {
    if (auction.status === "Open" && Math.random() > 0.7) {
      const recruiters = [
        "Global Re-Plast Inc",
        "Apex Glass Foundry",
        "Bio-Fuel Composting Corp",
        "Nova Electronics Recyclers",
        "Alliance Zero-Waste",
      ];
      const selectedRecruit = recruiters[Math.floor(Math.random() * recruiters.length)];
      const bidIncrement = Math.round((Math.random() * 15 + 5) * 10) / 10;
      const newBidVal = Number((auction.currentBidUsd + bidIncrement).toFixed(1));

      // Append new bid
      const newBid = {
        id: "bid-" + Date.now(),
        recyclerName: selectedRecruit,
        bidAmount: newBidVal,
        reputation: Number((4.1 + Math.random() * 0.9).toFixed(1)),
      };

      return {
        ...auction,
        currentBidUsd: newBidVal,
        bids: [...auction.bids, newBid].sort((a, b) => b.bidAmount - a.bidAmount),
      };
    }
    return auction;
  });

  // 5. Update GPU Performance parameters dynamically to look completely real-time
  centralState.gpu = {
    gpuUtilization: Number((70 + Math.random() * 18).toFixed(1)),
    vramTotalMb: 16384,
    vramUsedMb: Math.floor(11500 + Math.random() * 1900),
    temperatureCelsius: Number((62 + Math.random() * 6).toFixed(1)),
    activeStreamsCount: centralState.isStreamActive ? (centralState.activeCameraId === "cam-1" ? 4 : 3) : 2,
    inferenceSpeedMs: Number((12.5 + Math.random() * 4).toFixed(1)),
  };

}, 3000);

// API Endpoints

// GET Platform status and system state
app.get("/api/state", (req, res) => {
  res.json(centralState);
});

// POST Modify global user role trigger
app.post("/api/admin/role", (req, res) => {
  const { role } = req.body;
  if (role) {
    centralState.activeRole = role;
    res.json({ success: true, activeRole: role });
  } else {
    res.status(400).json({ error: "Missing 'role' parameter in body." });
  }
});

// POST Modify model config parameters
app.post("/api/admin/config", (req, res) => {
  const { detectionThreshold, isStreamActive, conveyorRunning, activeCameraId } = req.body;
  if (detectionThreshold !== undefined) centralState.detectionThreshold = detectionThreshold;
  if (isStreamActive !== undefined) centralState.isStreamActive = isStreamActive;
  if (conveyorRunning !== undefined) centralState.conveyorRunning = conveyorRunning;
  if (activeCameraId !== undefined) centralState.activeCameraId = activeCameraId;

  res.json({ success: true, config: {
    detectionThreshold: centralState.detectionThreshold,
    isStreamActive: centralState.isStreamActive,
    conveyorRunning: centralState.conveyorRunning,
    activeCameraId: centralState.activeCameraId,
  }});
});

// POST Acknowledge system alerts
app.post("/api/alerts/acknowledge", (req, res) => {
  const { alertId } = req.body;
  centralState.alerts = centralState.alerts.map((al) => {
    if (al.id === alertId) return { ...al, acknowledged: true };
    return al;
  });
  res.json({ success: true, alerts: centralState.alerts });
});

// POST Trigger custom simulated ESP32 smart-bin event/payload insertion
app.post("/api/bins/:binId/iot-payload", (req, res) => {
  const { binId } = req.params;
  const { fillLevel, weight, temperature, battery } = req.body;

  let found = false;
  centralState.bins = centralState.bins.map((bin) => {
    if (bin.id === binId) {
      found = true;
      const finalFill = fillLevel !== undefined ? Number(fillLevel) : bin.fillLevel;
      const finalWeight = weight !== undefined ? Number(weight) : bin.weight;
      const finalTemp = temperature !== undefined ? Number(temperature) : bin.temperature;
      const finalBat = battery !== undefined ? Number(battery) : bin.battery;

      let status: "Normal" | "Warning" | "Critical" = "Normal";
      if (finalFill >= 90) status = "Critical";
      else if (finalFill >= 75) status = "Warning";

      // If transition to critical and not already critical
      if (status === "Critical" && bin.status !== "Critical") {
        centralState.alerts.unshift({
          id: "al-" + Date.now(),
          timestamp: new Date().toISOString(),
          source: `ESP32 Smart Bin [${bin.name}]`,
          severity: "Critical",
          message: `ESP32 Smart Bin payload logged critical level: ${finalFill}% at weight ${finalWeight}kg.`,
          acknowledged: false,
        });
      }

      return {
        ...bin,
        fillLevel: finalFill,
        weight: finalWeight,
        temperature: finalTemp,
        battery: finalBat,
        status,
        lastReported: new Date().toISOString(),
        iotConnected: true,
      };
    }
    return bin;
  });

  if (found) {
    res.json({ success: true, message: `IOT state synchronizer processed for bin ${binId}` });
  } else {
    res.status(404).json({ error: `Bin with ID ${binId} not found.` });
  }
});

// POST Route optimizer - Graph collection logic
app.post("/api/route/optimize", (req, res) => {
  const { priorityFilter, startLocation } = req.body;

  // Real route optimize logic: find bins with Warning or Critical status
  const needyBins = centralState.bins
    .filter((bin) => bin.status !== "Normal")
    .map((bin) => bin.id);

  if (needyBins.length === 0) {
    // If no urgent bins, optimize path for highest fill level overall
    const sortedBins = [...centralState.bins].sort((a, b) => b.fillLevel - a.fillLevel);
    needyBins.push(sortedBins[0].id, sortedBins[1].id);
  }

  // Calculate dynamic optimized metric stats
  const stepsCount = needyBins.length;
  const savingLitres = Number((8.5 + (stepsCount * 2.3)).toFixed(1));
  const reductionKg = Number((savingLitres * 2.6).toFixed(1));
  const distanceKm = Number((10 + (stepsCount * 3.4)).toFixed(1));

  // Build the dynamic route
  const optimizedRouteId = "route-" + (100 + centralState.routes.length + 1);
  const newRoute = {
    id: optimizedRouteId,
    truckId: `TRUCK-X-${Math.floor(1000 + Math.random() * 9000)}`,
    driverName: "Chief Operator (Route AI)",
    priority: "High" as const,
    status: "Assigned" as const,
    currentLocation: startLocation || { lat: 1.2885, lng: 103.8495 },
    stops: needyBins,
    estimatedFuelSavedLitres: savingLitres,
    carbonReductionKg: reductionKg,
    totalDistanceKm: distanceKm,
    polyline: needyBins.map(id => {
      const b = centralState.bins.find(bin => bin.id === id);
      return b ? [b.latitude, b.longitude] as [number, number] : [1.2885, 103.8495] as [number, number];
    }),
  };

  centralState.routes.unshift(newRoute);
  
  // Push an alert indicating route optimization complete
  centralState.alerts.unshift({
    id: "al-" + Date.now(),
    timestamp: new Date().toISOString(),
    source: "Route Optimization Engine",
    severity: "Info",
    message: `Generated optimized collection path ${optimizedRouteId} targeting high-capacity bins: ${needyBins.join(", ")}. Fuel Saved: ${savingLitres}L.`,
    acknowledged: false,
  });

  res.json({ success: true, optimizedRoute: newRoute, allRoutes: centralState.routes });
});

// POST Register and Auction new sorted recyclable waste in Marketplace
app.post("/api/marketplace/auction", (req, res) => {
  const { title, category, quantityKg, estimatedPricePerKg } = req.body;

  if (!title || !category || !quantityKg) {
    return res.status(400).json({ error: "Missing required parameters (title, category, quantityKg)" });
  }

  const estVal = Number((quantityKg * (estimatedPricePerKg || 0.45)).toFixed(1));
  const newAuction = {
    id: "auc-" + Date.now(),
    title,
    category,
    quantityKg: Number(quantityKg),
    estimatedValueUsd: estVal,
    currentBidUsd: Number((estVal * 0.85).toFixed(1)),
    status: "Open" as const,
    listedDate: new Date().toISOString(),
    bids: [
      {
        id: "bid-" + Math.floor(Math.random() * 1000),
        recyclerName: "EcoSort AI Smart Broker",
        bidAmount: Number((estVal * 0.85).toFixed(1)),
        reputation: 4.9,
      }
    ],
  };

  centralState.auctions.unshift(newAuction);
  res.json({ success: true, auction: newAuction });
});

// POST Accept highest bid and update Circular Finances
app.post("/api/marketplace/accept-bid", (req, res) => {
  const { auctionId } = req.body;
  let finalPrice = 0;
  let success = false;
  let title = "";

  centralState.auctions = centralState.auctions.map((auc) => {
    if (auc.id === auctionId && auc.status === "Open") {
      success = true;
      finalPrice = auc.currentBidUsd;
      title = auc.title;
      // High bidder
      const topBidder = auc.bids[0];
      return {
        ...auc,
        status: "Sold" as const,
        salesPrice: finalPrice,
        buyerName: topBidder ? topBidder.recyclerName : "Direct Recycler Partner",
      };
    }
    return auc;
  });

  if (success) {
    // Add revenue to circular fund metrics
    centralState.carbon.revenueGeneratedUsd = Number((centralState.carbon.revenueGeneratedUsd + finalPrice).toFixed(2));
    
    // Log in alerts
    centralState.alerts.unshift({
      id: "al-" + Date.now(),
      timestamp: new Date().toISOString(),
      source: "Recycling Circular Economy Marketplace",
      severity: "Info",
      message: `Completed sale of bulk material: [${title}] for $${finalPrice}. Revenue disbursed to Circular City Fund.`,
      acknowledged: false,
    });

    res.json({ success: true, message: "Asset traded successfully!", ledger: centralState.carbon });
  } else {
    res.status(404).json({ error: "Active open auction not found or already settled." });
  }
});

// POST Direct Live Interactive Scan - Analyze with Real Gemini SDK + Image processing logic
app.post("/api/detection/scan", async (req, res) => {
  const { textDescription, presetImageKey } = req.body;

  if (!textDescription && !presetImageKey) {
    return res.status(400).json({ error: "Missing material description or asset key to classify." });
  }

  const query = textDescription || presetImageKey;
  console.log(`Analyzing segregation attributes for query: "${query}"`);

  // Define structured template schema for the decision engine
  const prompt = `Analyze this descriptive waste item: "${query}". You are the core of EcoSort AI Smart Segregation Platform. Categorize this object and provide a highly technical segregation output. You MUST return a JSON object container matching EXACTLY these keys:
{
  "item": "Exact normalized item name",
  "category": "One of: Plastic, Glass, Metal, Organic, Hazardous, E-Waste",
  "confidence": A number from 85.0 to 99.8 reflecting YOLO confidence simulation,
  "recommendedBin": "Descriptive color storage bin name",
  "colorCode": "Hex color code matching the category: Plastic=>#3b82f6, Glass=>#06b6d4, Metal=>#eab308, Organic=>#22c55e, Hazardous=>#ef4444, E-Waste=>#a855f7",
  "areaPercentage": Number of pixels scale bounds estimated from 5 to 30,
  "estimatedValue": Predicted market scrap value per kilogram in USD (e.g. 0.15 to 2.50),
  "recyclingDifficulty": "Easy" or "Moderate" or "Hard",
  "funFact": "One-line interesting engineering or dynamic sustainability fact about recycling this precise item"
}`;

  let analysisResult;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              category: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              recommendedBin: { type: Type.STRING },
              colorCode: { type: Type.STRING },
              areaPercentage: { type: Type.NUMBER },
              estimatedValue: { type: Type.NUMBER },
              recyclingDifficulty: { type: Type.STRING },
              funFact: { type: Type.STRING },
            },
            required: ["item", "category", "confidence", "recommendedBin", "colorCode", "estimatedValue", "funFact"],
          },
        },
      });

      const responseText = response.text ? response.text.trim() : "";
      analysisResult = JSON.parse(responseText);
      console.log("Structured Gemini Analysis parsed:", analysisResult);
    } catch (apiError) {
      console.error("Gemini API call returned error. Falling back to local segment analyzer:", apiError);
    }
  }

  // Backup Deterministic High-Acuity Parser (runs if API key is not present or throws)
  if (!analysisResult) {
    analysisResult = fallbackLocalAnalysis(query);
  }

  // Create corresponding detection element, appending Load Cell sensor weight simulation
  const weightVal = Number((0.05 + Math.random() * 0.95).toFixed(3));
  const newDet = {
    id: "det-ai-" + Date.now(),
    timestamp: new Date().toISOString(),
    item: analysisResult.item,
    category: analysisResult.category as any,
    confidence: analysisResult.confidence || 95.5,
    areaPercentage: analysisResult.areaPercentage || 12.5,
    weightKg: weightVal,
    colorCode: analysisResult.colorCode,
    recommendedBin: analysisResult.recommendedBin,
    coordinates: {
      x: 180,
      y: 110,
      w: 120,
      h: 180,
    },
    sensorFusionStatus: "Verified" as const,
    location: "Live Sandbox Classifier UI",
    processed: true,
  };

  // Prepend to detections
  centralState.detections.unshift(newDet);
  
  // Update carbon numbers in the circular audit instantly
  let co2SavedFactor = 1.3;
  if (analysisResult.category === "Plastic") co2SavedFactor = 1.5;
  else if (analysisResult.category === "Metal") co2SavedFactor = 4.2;
  else if (analysisResult.category === "Glass") co2SavedFactor = 0.9;

  centralState.carbon = {
    totalRecycledKg: Number((centralState.carbon.totalRecycledKg + weightVal).toFixed(1)),
    co2SavedKg: Number((centralState.carbon.co2SavedKg + (weightVal * co2SavedFactor)).toFixed(1)),
    revenueGeneratedUsd: Number((centralState.carbon.revenueGeneratedUsd + (weightVal * (analysisResult.estimatedValue || 0.35))).toFixed(2)),
    energySavedMwh: Number((centralState.carbon.energySavedMwh + (weightVal * 0.0025)).toFixed(4)),
    landfillDiversionRate: Number(Math.min(99.5, centralState.carbon.landfillDiversionRate + 0.002).toFixed(2)),
  };

  res.json({ success: true, detection: newDet, details: analysisResult });
});

// Helper: Backup Deterministic Smart Classification Logic
function fallbackLocalAnalysis(query: string) {
  const norm = query.toLowerCase();

  let item = "Identified Custom Waste Segment";
  let category: "Plastic" | "Glass" | "Metal" | "Organic" | "Hazardous" | "E-Waste" = "Plastic";
  let confidence = 93.6;
  let recommendedBin = "Blue Storage Bin (Plastics)";
  let colorCode = "#3b82f6";
  let areaPercentage = 14.5;
  let estimatedValue = 0.35;
  let recyclingDifficulty = "Easy";
  let funFact = "Sorting plastics securely maintains purity profiles for high-value extrusion moulding.";

  if (norm.includes("bottle") || norm.includes("pet") || norm.includes("plastic") || norm.includes("hdpe") || norm.includes("polyester")) {
    item = "Polyethylene Terephthalate Liquid Vessel";
    category = "Plastic";
    recommendedBin = "Blue Storage Bin (Plastics)";
    colorCode = "#3b82f6";
    estimatedValue = 0.45;
    funFact = "Recycling PET resins saves roughly 66% of the energy compared to refining virgin petroleum raw materials.";
  } else if (norm.includes("can") || norm.includes("soda") || norm.includes("aluminum") || norm.includes("metal") || norm.includes("steel") || norm.includes("tin")) {
    item = "Structural Alloy Aluminum Beverage Can";
    category = "Metal";
    recommendedBin = "Yellow Storage Bin (Metals)";
    colorCode = "#eab308";
    estimatedValue = 1.20;
    recyclingDifficulty = "Easy";
    funFact = "Recycling alumimum requires 95% less thermal energy than electrolysis of raw bauxite ore.";
  } else if (norm.includes("beer") || norm.includes("glass") || norm.includes("jar") || norm.includes("beaker") || norm.includes("silica")) {
    item = "Borosilicate Silica Container Glass";
    category = "Glass";
    recommendedBin = "Turquoise Bin (Glass)";
    colorCode = "#06b6d4";
    estimatedValue = 0.18;
    recyclingDifficulty = "Moderate";
    funFact = "Glass can be melted down and reformed infinitely without any structural degradation in quality.";
  } else if (norm.includes("food") || norm.includes("apple") || norm.includes("organic") || norm.includes("banana") || norm.includes("vegetable") || norm.includes("bread") || norm.includes("cardboard") || norm.includes("paper")) {
    item = "Lignocellulosic Fiber Compound / Compostable";
    category = "Organic";
    recommendedBin = "Green Compost Bin (Compostables)";
    colorCode = "#22c55e";
    estimatedValue = 0.12;
    recyclingDifficulty = "Easy";
    funFact = "Composting diverts nutrient blocks back into municipal soil cycles, completely mitigating greenhouse gas methane production.";
  } else if (norm.includes("battery") || norm.includes("chemical") || norm.includes("acid") || norm.includes("lithium") || norm.includes("paint") || norm.includes("hazardous") || norm.includes("medical")) {
    item = "Mercury or Lithium-Core Household Cell";
    category = "Hazardous";
    recommendedBin = "Red Container Bin (Hazardous)";
    colorCode = "#ef4444";
    estimatedValue = 0.10;
    recyclingDifficulty = "Hard";
    funFact = "Diverting batteries prevents toxic cadmium, lead, and sulfuric acid and cobalt compounds from corrupting deep water tables.";
  } else if (norm.includes("phone") || norm.includes("pcb") || norm.includes("board") || norm.includes("wire") || norm.includes("charger") || norm.includes("electronic") || norm.includes("chip")) {
    item = "Doped Semiconductor Electronics Assembly";
    category = "E-Waste";
    recommendedBin = "Purple Tech Bin (E-Waste)";
    colorCode = "#a855f7";
    estimatedValue = 2.10;
    recyclingDifficulty = "Hard";
    funFact = "One metric ton of computer circuit boards contains up to 100 times more gold than a ton of standard raw gold ore mines.";
  }

  return {
    item,
    category,
    confidence,
    recommendedBin,
    colorCode,
    areaPercentage,
    estimatedValue,
    recyclingDifficulty,
    funFact,
  };
}

// Vite integration middleware setup
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA Fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files mounted from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoSort AI fullstack server successfully running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
