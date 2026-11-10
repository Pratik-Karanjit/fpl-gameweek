"use client";

import React from "react";
import { Activity, RefreshCw } from "lucide-react";

interface NavbarProps {
  currentGameweek: number | null;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentGameweek,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Official Premier League Fantasy Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://fantasy.premierleague.com/assets/headline-logo-DgE6C_gE.svg"
              alt="Premier League Fantasy"
              className="h-8 w-auto object-contain"
            />
            <div className="hidden sm:block border-l border-gray-200 pl-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wider text-[#37003C]">
                  LEAGUE PULSE
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#E0F9FF] text-[#0096AD] border border-[#B3F2FD]">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-none mt-0.5">
                Dynamic Mini-League Analytics & Ranking Engine
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Active Gameweek Pill */}
          {currentGameweek && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F3E8F5] border border-[#D8C5DF] rounded-full text-xs font-bold text-[#37003C]">
              <Activity className="w-3.5 h-3.5 text-[#00BDD6] animate-pulse" />
              <span>GW {currentGameweek} Live</span>
            </div>
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Data"
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-[#37003C] transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#37003C]" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
