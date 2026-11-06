"use client";

import React from "react";
import { AggregatedManagerEntry } from "@/types/fpl";
import { formatMillions } from "@/lib/utils";
import { Crown, Flame, BarChart3, Coins, Zap } from "lucide-react";

interface LeagueSummaryCardsProps {
  entries: AggregatedManagerEntry[];
  selectedGw: number;
}

export const LeagueSummaryCards: React.FC<LeagueSummaryCardsProps> = ({
  entries,
  selectedGw,
}) => {
  if (!entries || entries.length === 0) return null;

  // 1. Leader by total points
  const leader = [...entries].sort((a, b) => b.total_points - a.total_points)[0];

  // 2. Highest scorer for selected GW
  const highestGwScorer = [...entries].sort(
    (a, b) => b.selected_gw_points - a.selected_gw_points
  )[0];

  // 3. Average GW points
  const totalGwPoints = entries.reduce((acc, curr) => acc + curr.selected_gw_points, 0);
  const avgGwPoints = (totalGwPoints / entries.length).toFixed(1);

  // 4. Most valuable squad
  const richestManager = [...entries].sort(
    (a, b) => b.total_budget - a.total_budget
  )[0];

  // 5. Total chips played in league
  const totalChipsUsed = entries.reduce((acc, curr) => acc + curr.chips.length, 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-6">
      {/* 1. Leader */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
          <span>League Leader</span>
          <Crown className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold text-gray-900 truncate">{leader.player_name}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#37003C]">{leader.total_points}</span>
            <span className="text-xs text-gray-500 font-medium">pts total</span>
          </div>
        </div>
      </div>

      {/* 2. GW Top Performer */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
          <span>GW {selectedGw} Top Score</span>
          <Flame className="w-4 h-4 text-[#00A859]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold text-gray-900 truncate">
            {highestGwScorer.team_name}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#00A859]">
              {highestGwScorer.selected_gw_points}
            </span>
            <span className="text-xs text-gray-500 font-medium">pts</span>
          </div>
        </div>
      </div>

      {/* 3. League GW Average */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
          <span>GW {selectedGw} Average</span>
          <BarChart3 className="w-4 h-4 text-[#00BDD6]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold text-gray-700">Across {entries.length} Managers</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#37003C]">{avgGwPoints}</span>
            <span className="text-xs text-gray-500 font-medium">pts avg</span>
          </div>
        </div>
      </div>

      {/* 4. Highest Squad Value */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
          <span>Richest Squad</span>
          <Coins className="w-4 h-4 text-amber-500" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold text-gray-900 truncate">{richestManager.player_name}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-gray-900">
              {formatMillions(richestManager.total_budget)}
            </span>
            <span className="text-xs text-[#0284C7] font-semibold">(Bank: {formatMillions(richestManager.bank)})</span>
          </div>
        </div>
      </div>

      {/* 5. Chips Played */}
      <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-white border border-gray-200 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
          <span>Chips Played</span>
          <Zap className="w-4 h-4 text-[#5F3290]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold text-gray-700">Mini-League Total</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#5F3290]">{totalChipsUsed}</span>
            <span className="text-xs text-gray-500 font-medium">chips activated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
