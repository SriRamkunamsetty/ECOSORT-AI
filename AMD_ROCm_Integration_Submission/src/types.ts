export type UserRole = "Field Operator" | "Municipal Manager" | "Recycling Plant Operator" | "Admin";

export interface WasteDetection {
  id: string;
  timestamp: string;
  item: string;
  category: "Plastic" | "Glass" | "Metal" | "Organic" | "Hazardous" | "E-Waste";
  confidence: number;
  areaPercentage: number; // For pixel-level segmentation mask area
  weightKg: number; // Simulated from Load Cell HX711
  colorCode: string; // recommended bin color
  recommendedBin: string;
  coordinates: { x: number; y: number; w: number; h: number }; // Bounding box for YOLOv11 simulation
  sensorFusionStatus: "Verified" | "Mismatched" | "Pending";
  location: string;
  processed: boolean;
}

export interface SmartBin {
  id: string;
  name: string;
  zone: string;
  latitude: number;
  longitude: number;
  binType: "Plastic" | "Glass" | "Metal" | "Organic" | "Hazardous" | "E-Waste";
  fillLevel: number; // Percentage
  weight: number; // kg
  temperature: number; // Celsius
  overflowPredictedHours: number; // LSTM prediction
  lastReported: string;
  battery: number;
  status: "Normal" | "Warning" | "Critical";
  iotConnected: boolean;
}

export interface CollectionRoute {
  id: string;
  truckId: string;
  driverName: string;
  priority: "High" | "Medium" | "Low";
  status: "Assigned" | "In Progress" | "Completed";
  currentLocation: { lat: number; lng: number };
  stops: string[]; // Bins IDs in order
  estimatedFuelSavedLitres: number;
  carbonReductionKg: number;
  totalDistanceKm: number;
  polyline: Array<[number, number]>;
}

export interface RecyclerBid {
  id: string;
  recyclerName: string;
  bidAmount: number;
  currency?: string;
  reputation: number; // 1-5 stars
}

export interface MarketplaceAuction {
  id: string;
  title: string;
  category: "Plastic" | "Glass" | "Metal" | "Organic" | "Hazardous" | "E-Waste";
  quantityKg: number;
  estimatedValueUsd: number;
  currentBidUsd: number;
  status: "Open" | "Sold";
  bids: RecyclerBid[];
  salesPrice?: number;
  buyerName?: string;
  listedDate: string;
}

export interface CarbonMetrics {
  totalRecycledKg: number;
  co2SavedKg: number;
  landfillDiversionRate: number; // percent
  energySavedMwh: number;
  revenueGeneratedUsd: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  source: string; // e.g. "Smart Bin 04 (Zone B)" or "Camera Stream 02"
  severity: "Info" | "Warning" | "Critical";
  message: string;
  acknowledged: boolean;
}

export interface GPUMetrics {
  gpuUtilization: number;
  vramTotalMb: number;
  vramUsedMb: number;
  temperatureCelsius: number;
  activeStreamsCount: number;
  inferenceSpeedMs: number;
}

export interface SystemState {
  detections: WasteDetection[];
  bins: SmartBin[];
  routes: CollectionRoute[];
  auctions: MarketplaceAuction[];
  carbon: CarbonMetrics;
  alerts: Alert[];
  gpu: GPUMetrics;
  activeRole: UserRole;
  detectionThreshold: number;
  isStreamActive: boolean;
  conveyorRunning: boolean;
  activeCameraId: string;
}
