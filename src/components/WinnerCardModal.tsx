"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trophy,
  Download,
  Sparkles,
  ExternalLink,
  Coins,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export interface WinnerCardData {
  entryId: number;
  gw: number;
  playerName: string;
  teamName: string;
  points: number;
  leagueName: string;
  prizeMoney?: string;
}

interface WinnerCardModalProps {
  data: WinnerCardData | null;
  onClose: () => void;
}

function buildCardUrl(data: WinnerCardData, prizeMoney: string): string {
  const params = new URLSearchParams({
    entryId: String(data.entryId),
    gw: String(data.gw),
    playerName: data.playerName,
    teamName: data.teamName,
    points: String(data.points),
    leagueName: data.leagueName,
    prizeMoney: prizeMoney.trim() || "Winner",
  });
  return `/api/fpl/winner-card?${params.toString()}`;
}

export const WinnerCardModal: React.FC<WinnerCardModalProps> = ({
  data,
  onClose,
}) => {
  const [prizeMoney, setPrizeMoney] = useState<string>("Rs. 2,000");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Reset state when data changes
  useEffect(() => {
    if (data) {
      setGeneratedUrl(null);
      setError(null);
      setIsGenerating(false);
      if (data.prizeMoney) setPrizeMoney(data.prizeMoney);
    }
  }, [data]);

  if (!data) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const url = buildCardUrl(data, prizeMoney);

      // Validate the image loads successfully
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to generate card (status ${res.status})`);
      }

      setGeneratedUrl(url);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error generating winner card";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedUrl) return;
    try {
      const res = await fetch(generatedUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `winner-gw${data.gw}-${data.entryId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError("Failed to download the image.");
    }
  };

  const PRESET_PRIZES = [
    "Rs. 1,000",
    "Rs. 2,000",
    "Rs. 5,000",
    "£50",
    "£100",
    "$50",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#37003C] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-sm">
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#00FF87] text-[#1F0022]">
                  GW {data.gw} WINNER POSTER
                </span>
                <span className="text-xs text-purple-200 font-mono">
                  #{data.entryId}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {data.teamName}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-5 flex-1 bg-[#F8F9FA]">
          {/* Winner Details Card */}
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Manager
              </span>
              <span className="text-sm font-bold text-gray-900 truncate block mt-0.5">
                {data.playerName}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Gameweek
              </span>
              <span className="text-sm font-bold text-[#37003C] block mt-0.5">
                GW {data.gw}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                GW Points
              </span>
              <span className="text-sm font-black text-[#00A859] block mt-0.5">
                {data.points} pts
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                League
              </span>
              <span className="text-sm font-bold text-gray-700 truncate block mt-0.5">
                {data.leagueName}
              </span>
            </div>
          </div>

          {/* Prize Money Input Section */}
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>Prize Money Won</span>
              </label>
              <span className="text-[11px] text-gray-500">
                Printed on the final badge
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={prizeMoney}
                onChange={(e) => setPrizeMoney(e.target.value)}
                placeholder="e.g. Rs. 2,000, £50, $100..."
                className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#37003C]"
              />
            </div>

            {/* Quick Currency Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-gray-400 font-medium mr-1">
                Presets:
              </span>
              {PRESET_PRIZES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPrizeMoney(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                    prizeMoney === preset
                      ? "bg-[#37003C] text-white border-[#37003C]"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-800">Generation Failed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedUrl && (
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center text-xs">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Winner Card Generated!</span>
                </span>
              </div>

              {/* Image Preview Box */}
              <div className="rounded-xl overflow-hidden border border-gray-300 bg-[#18001d] flex items-center justify-center max-h-[520px] overflow-y-auto relative shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedUrl}
                  alt="Generated Winner Poster"
                  className="w-full h-auto object-contain max-h-[520px] shadow-lg"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  <span>View Full Size</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#00A859] hover:bg-[#008f4c] text-white transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Poster</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#37003C] hover:bg-[#4D0054] text-white flex items-center gap-2 shadow-md shadow-purple-950/20 disabled:opacity-50 transition cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Capturing real FPL pitch screenshot...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#00FF87]" />
                <span>
                  {generatedUrl ? "Re-generate Poster" : "Generate Poster"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
