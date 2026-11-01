"use client";

import React from "react";
import { Trophy, Sparkles, Activity, ShieldCheck, RefreshCw } from "lucide-react";

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
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/40 bg-[#160018]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#37003c] via-[#74007d] to-[#00ff87] p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <div className="w-full h-full bg-[#160018] rounded-[10px] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                FPL LEAGUE PULSE
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Dynamic Mini-League Analytics & Ranking Engine
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Active Gameweek Pill */}
          {currentGameweek && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-purple-900/40 border border-purple-700/40 rounded-full text-xs font-semibold text-purple-200">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>GW {currentGameweek} Live</span>
            </div>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Data"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          )}

          {/* Demo Data Toggle */}
          <button
            onClick={() => onToggleDemo(!isDemo)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              isDemo
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
          >
            {isDemo ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Demo Mode Active</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Live FPL API</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

