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
    <header className="sticky top-0 z-40 w-full border-b border-[#54245A] bg-[#1F0022]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Premier League Fantasy Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {/* Official FPL headline logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://fantasy.premierleague.com/assets/headline-logo-DgE6C_gE.svg"
              alt="Premier League Fantasy Logo"
              className="h-9 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(11,230,255,0.25)]"
            />
            <div className="hidden sm:block border-l border-[#54245A] pl-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-white">
                  LEAGUE PULSE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#0BE6FF]/15 text-[#0BE6FF] border border-[#0BE6FF]/30">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#A28DA6] font-medium leading-none mt-0.5">
                Dynamic Mini-League Analytics & Ranking Engine
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Active Gameweek Pill */}
          {currentGameweek && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#37003C] border border-[#54245A] rounded-full text-xs font-semibold text-[#0BE6FF]">
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
              className="p-2 rounded-xl bg-[#28002B] hover:bg-[#37003C] border border-[#54245A] text-[#A28DA6] hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#0BE6FF]" : ""}`} />
            </button>
          )}

          {/* Demo Data Toggle */}
          <button
            onClick={() => onToggleDemo(!isDemo)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              isDemo
                ? "bg-[#0BE6FF]/15 border-[#0BE6FF]/50 text-[#0BE6FF] shadow-sm shadow-[#0BE6FF]/20"
                : "bg-[#28002B] border-[#54245A] text-[#A28DA6] hover:text-white hover:bg-[#37003C]"
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
