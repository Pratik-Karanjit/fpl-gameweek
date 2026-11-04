"use client";

import React from "react";
import { Sparkles, Activity, ShieldCheck, RefreshCw } from "lucide-react";

interface NavbarProps {
  currentGameweek: number | null;
  isDemo: boolean;
  onToggleDemo: (val: boolean) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentGameweek,
  isDemo,
  onToggleDemo,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#6F2E77] bg-[#37003C]/95 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Premier League Fantasy Logo */}
        <div className="flex items-center gap-3">
          {/* Logo container with white/cyan glow so the official SVG is crisp and fully visible */}
          <div className="flex items-center gap-2.5 bg-[#480050] px-3 py-1.5 rounded-xl border border-[#6F2E77] shadow-md shadow-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://fantasy.premierleague.com/assets/headline-logo-DgE6C_gE.svg"
              alt="Premier League Fantasy"
              className="h-7 w-auto object-contain brightness-0 invert drop-shadow-[0_0_8px_rgba(11,230,255,0.4)]"
            />
          </div>

          <div className="hidden sm:block border-l border-[#6F2E77] pl-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white">
                LEAGUE PULSE
              </span>
              <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-[#0BE6FF]/20 text-[#0BE6FF] border border-[#0BE6FF]/40">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-[#A28DA6] font-medium leading-none mt-0.5">
              Dynamic Mini-League Analytics & Ranking Engine
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Active Gameweek Pill */}
          {currentGameweek && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#480050] border border-[#6F2E77] rounded-full text-xs font-semibold text-[#0BE6FF]">
              <Activity className="w-3.5 h-3.5 text-[#0BE6FF] animate-pulse" />
              <span>GW {currentGameweek} Live</span>
            </div>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Data"
              className="p-2 rounded-xl bg-[#480050] hover:bg-[#5F3290] border border-[#6F2E77] text-[#A28DA6] hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#0BE6FF]" : ""}`} />
            </button>
          )}

          {/* Demo Data Toggle */}
          <button
            onClick={() => onToggleDemo(!isDemo)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
              isDemo
                ? "bg-[#0BE6FF]/20 border-[#0BE6FF]/60 text-[#0BE6FF] shadow-sm shadow-[#0BE6FF]/25"
                : "bg-[#480050] border-[#6F2E77] text-[#A28DA6] hover:text-white hover:bg-[#5F3290]"
            }`}
          >
            {isDemo ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#0BE6FF]" />
                <span>Demo Mode</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#A28DA6]" />
                <span>Live FPL API</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
