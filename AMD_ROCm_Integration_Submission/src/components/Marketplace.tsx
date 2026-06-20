import React, { useState } from "react";
import { MarketplaceAuction } from "../types";
import { 
  Coins, 
  Plus, 
  CheckCircle, 
  Trash2, 
  DollarSign, 
  Scale, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Award
} from "lucide-react";

interface MarketplaceProps {
  auctions: MarketplaceAuction[];
  onAddAuction: (payload: {
    title: string;
    category: string;
    quantityKg: number;
    estimatedPricePerKg: number;
  }) => Promise<any>;
  onAcceptTopBid: (auctionId: string) => Promise<any>;
}

export default function Marketplace({
  auctions,
  onAddAuction,
  onAcceptTopBid
}: MarketplaceProps) {
  // Local form states
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Plastic");
  const [newQuantity, setNewQuantity] = useState<number | "">("");
  const [newPricePerKg, setNewPricePerKg] = useState<number | "">("");
  
  const [publishing, setPublishing] = useState(false);
  const [tradingId, setTradingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmitAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCategory || !newQuantity || !newPricePerKg) return;

    setPublishing(true);
    setFeedback(null);
    try {
      await onAddAuction({
        title: newTitle,
        category: newCategory,
        quantityKg: Number(newQuantity),
        estimatedPricePerKg: Number(newPricePerKg)
      });
      setNewTitle("");
      setNewQuantity("");
      setNewPricePerKg("");
      setFeedback("Recyclable material segment successfully registered and listed! Bidding is now open to registered certified recyclers.");
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error(err);
      setFeedback("Error listing material batch.");
    } finally {
      setPublishing(false);
    }
  };

  const handleTransactBid = async (auctionId: string) => {
    setTradingId(auctionId);
    setFeedback(null);
    try {
      const res = await onAcceptTopBid(auctionId);
      setFeedback(`Transaction settled! Bulk asset cleanly traded. Cash revenue of $${res.ledger ? res.ledger.revenueGeneratedUsd : ""} successfully transferred to Circular Economy Sustainability Ledger.`);
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      console.error(err);
      setFeedback("Failed to complete asset transfer.");
    } finally {
      setTradingId(null);
    }
  };

  const marketPricePredictionsRange = [
    { name: "Crushed PET Platsics (Grade A)", current: 0.45, predicted: 0.58, trend: "Upward (+28%)" },
    { name: "Structural Aluminum Shreds", current: 1.25, predicted: 1.48, trend: "Upward (+18%)" },
    { name: "Cullet Silica Glass Crushed", current: 0.15, predicted: 0.13, trend: "Stable (-1%)" },
    { name: "Raw Copper PCB Boards", current: 2.10, predicted: 2.45, trend: "Upward (+16%)" },
    { name: "Paper Cardboard Pulp", current: 0.18, predicted: 0.22, trend: "Upward (+22%)" }
  ];

  const certifiedPartnersList = [
    { name: "Apex Solder Foundry", category: "Metal/E-Waste", rating: 4.9, activeAuctions: "Premium Partner" },
    { name: "GreenTech Cycle Corp", category: "Plastics/Resins", rating: 4.8, activeAuctions: "Global Tier" },
    { name: "GlassCorp Environmental Ltd", category: "Glass/Silica", rating: 4.5, activeAuctions: "Regional Tier" }
  ];

  const getCatColor = (cat: string) => {
    switch (cat) {
      case "Plastic": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Glass": return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Metal": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Organic": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Hazardous": return "bg-rose-50 text-rose-700 border-rose-200";
      case "E-Waste": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      
      {/* Active Marketplace listings and auctions */}
      <div className="lg:col-span-2 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-sans text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Coins className="h-4.5 w-4.5 text-emerald-500 animate-pulse-slow" />
              Circular Commodity Trading Yard
            </h3>
            <p className="text-[11px] text-gray-500 font-sans">
              Auction clean segregated waste aggregates directly to verified commercial recyclers
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-750 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> AI CLASSIFIED SECURITY
          </span>
        </div>

        {feedback && (
          <div className="rounded-2xl bg-indigo-50 border border-indigo-150 p-4 font-mono text-[11px] text-indigo-700 leading-relaxed shadow-sm animate-fade-in">
            ⚡ <strong>Recycling Broker Response:</strong> {feedback}
          </div>
        )}

        <div className="space-y-4">
          {auctions.map((auction) => {
            const isSold = auction.status === "Sold";
            const topBidder = auction.bids[0];
            return (
              <div 
                key={auction.id}
                className={`rounded-2xl border bg-white p-5 hover:shadow-md transition-all space-y-4 ${isSold ? "border-gray-250 bg-gray-50/50" : "border-gray-100"}`}
              >
                
                {/* Header detail */}
                <div className="flex items-start justify-between border-b border-gray-50 pb-3">
                  <div className="max-w-[70%]">
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-bold border mb-1.5 ${getCatColor(auction.category)}`}>
                      {auction.category} Aggregate
                    </span>
                    <h4 className={`font-sans text-xs font-bold text-gray-950 ${isSold ? "line-through text-gray-400" : ""}`} title={auction.title}>
                      {auction.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5 flex items-center gap-1">
                      <Scale className="h-3 w-3 text-gray-400" /> Quantity Listed: <strong>{auction.quantityKg} kg</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold ${isSold ? "bg-gray-150 text-gray-650" : "bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse-slow"}`}>
                      {auction.status}
                    </span>
                    <span className="block text-[8px] text-gray-400 font-mono mt-1">{new Date(auction.listedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Bidding progression log block */}
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  {/* Ledger valuation values */}
                  <div className="rounded-xl bg-gray-50 p-3 border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">AI Estimated Base Scrap Value:</span>
                      <strong className="text-gray-700 font-mono">${auction.estimatedValueUsd.toFixed(1)}</strong>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200/50 pt-1.5">
                      <span className="text-xs font-semibold text-gray-650">{isSold ? "Final Sales price cleared:" : "Current leading recycler bid:"}</span>
                      <strong className="font-mono text-base font-extrabold text-emerald-600 block">${auction.currentBidUsd.toFixed(1)}</strong>
                    </div>
                  </div>

                  {/* Top high bid buyer reputation details */}
                  <div className="text-[10px] space-y-1.5">
                    {topBidder ? (
                      <div className="rounded-xl border border-dashed border-gray-200 p-2.5 bg-gray-50/20">
                        <span className="block text-[8px] uppercase tracking-wider font-bold text-gray-400">Leading Buyer Bids Ledger</span>
                        <div className="flex items-center justify-between mt-1">
                          <strong className="text-gray-800 text-xs truncate max-w-[120px]">{topBidder.recyclerName}</strong>
                          <span className="text-right text-emerald-600 font-mono font-bold">${topBidder.bidAmount}</span>
                        </div>
                        <p className="text-[9px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                          ⭐ Reputation score: <strong>{topBidder.reputation}/5.0</strong>
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">No incoming bidder frames parsed from broker stream yet.</p>
                    )}
                  </div>

                </div>

                {/* Transaction Action buttons */}
                {!isSold && (
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Award className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Certified bidding escrow secured</span>
                    </div>

                    <button
                      onClick={() => handleTransactBid(auction.id)}
                      disabled={tradingId === auction.id}
                      id={`marketplace_btn_${auction.id}`}
                      className="group flex items-center gap-1 rounded-xl bg-gray-950 font-sans text-xs font-bold text-white hover:bg-emerald-600 px-4 py-2 disabled:bg-gray-200 transition-colors"
                    >
                      {tradingId === auction.id ? (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      ) : (
                        <>Accept Top Bid & Release Stock <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* Forms inputs side widget: List new materials */}
      <div className="space-y-6">
        
        {/* Listing Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Plus className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold text-gray-950">Enroll Sorted Cargo</h4>
              <p className="text-[10px] text-gray-400">Auction separated stockpiles into the Circular Ring</p>
            </div>
          </div>

          <form onSubmit={handleSubmitAuction} className="space-y-4">
            
            {/* Title batch desc */}
            <div>
              <label htmlFor="batch_title_input" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Batch Description Title:
              </label>
              <input
                id="batch_title_input"
                type="text"
                placeholder="e.g. Clean Shredded Grade-B HDPE Flakes"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans font-semibold text-gray-800"
              />
            </div>

            {/* Category selection */}
            <div>
              <label htmlFor="batch_cat_select" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Material Category:
              </label>
              <select
                id="batch_cat_select"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-500 transition-all font-semibold font-sans text-gray-600"
              >
                <option value="Plastic">Plastic</option>
                <option value="Glass">Glass</option>
                <option value="Metal">Metal</option>
                <option value="Organic">Organic (Compostables / Pulp)</option>
                <option value="Hazardous">Hazardous</option>
                <option value="E-Waste">E-Waste</option>
              </select>
            </div>

            {/* Quantity weight in kgs */}
            <div>
              <label htmlFor="batch_qty_input" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Aggregate weight in Kilograms:
              </label>
              <input
                id="batch_qty_input"
                type="number"
                placeholder="e.g. 1500"
                min="5"
                max="50000"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value !== "" ? Number(e.target.value) : "")}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 transition-all font-sans font-semibold text-gray-800"
              />
            </div>

            {/* Base estimated price per kg */}
            <div>
              <label htmlFor="batch_price_input" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                Approximate AI base Scrap valuation $/kg:
              </label>
              <input
                id="batch_price_input"
                type="number"
                placeholder="e.g. 0.45"
                step="0.05"
                min="0.05"
                max="5.0"
                value={newPricePerKg}
                onChange={(e) => setNewPricePerKg(e.target.value !== "" ? Number(e.target.value) : "")}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-500 transition-all font-sans font-semibold text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={publishing || !newTitle}
              id="marketplace_auction_submit_btn"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gray-950 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md disabled:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4" /> Publish Escrow Auction
            </button>

          </form>

        </div>

        {/* AI Marketplace price projections (from Gemini/Linear model) */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/15 p-6 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-150 text-indigo-700">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold text-gray-950">AI Pricing Projections (Q3)</h4>
              <p className="text-[10px] text-gray-400">Gemini-model Circular scrap value forecasts</p>
            </div>
          </div>

          <div className="space-y-3">
            {marketPricePredictionsRange.map((pred, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-100/50 pb-2">
                <div>
                  <span className="font-bold text-gray-800 block truncate max-w-[140px]">{pred.name}</span>
                  <span className="text-[9px] text-gray-400 font-mono">Today: ${pred.current}/kg</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-black text-gray-900">Projected: ${pred.predicted}/kg</span>
                  <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-wide font-mono mt-0.5">{pred.trend}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
