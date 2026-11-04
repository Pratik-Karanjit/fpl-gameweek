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
      <div className="p-4 rounded-2xl bg-[#28002B] border border-[#54245A] flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-[#A28DA6] text-xs font-bold uppercase tracking-wider">
          <span>League Leader</span>
          <Crown className="w-4 h-4 text-[#35B9FB]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold text-white truncate">{leader.player_name}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#0BE6FF]">{leader.total_points}</span>
            <span className="text-xs text-[#A28DA6] font-medium">pts total</span>
          </div>
        </div>
      </div>

      {/* 2. GW Top Performer */}
      <div className="p-4 rounded-2xl bg-[#28002B] border border-[#54245A] flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-[#A28DA6] text-xs font-bold uppercase tracking-wider">
          <span>GW {selectedGw} Top Score</span>
          <Flame className="w-4 h-4 text-[#0BE6FF]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold text-white truncate">
            {highestGwScorer.team_name}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#0BE6FF]">
              {highestGwScorer.selected_gw_points}
            </span>
            <span className="text-xs text-[#A28DA6] font-medium">pts</span>
          </div>
        </div>
      </div>

      {/* 3. League GW Average */}
      <div className="p-4 rounded-2xl bg-[#28002B] border border-[#54245A] flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-[#A28DA6] text-xs font-bold uppercase tracking-wider">
          <span>GW {selectedGw} Average</span>
          <BarChart3 className="w-4 h-4 text-[#6A72F6]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold text-[#E9E6EB]">Across {entries.length} Managers</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#6A72F6]">{avgGwPoints}</span>
            <span className="text-xs text-[#A28DA6] font-medium">pts avg</span>
          </div>
        </div>
      </div>

      {/* 4. Highest Squad Value */}
      <div className="p-4 rounded-2xl bg-[#28002B] border border-[#54245A] flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-[#A28DA6] text-xs font-bold uppercase tracking-wider">
          <span>Richest Squad</span>
          <Coins className="w-4 h-4 text-[#35B9FB]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold text-white truncate">{richestManager.player_name}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-white">
              {formatMillions(richestManager.total_budget)}
            </span>
            <span className="text-xs text-[#35B9FB] font-semibold">(Bank: {formatMillions(richestManager.bank)})</span>
          </div>
        </div>
      </div>

      {/* 5. Chips Played */}
      <div className="col-span-2 lg:col-span-1 p-4 rounded-2xl bg-[#28002B] border border-[#54245A] flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-[#A28DA6] text-xs font-bold uppercase tracking-wider">
          <span>Chips Played</span>
          <Zap className="w-4 h-4 text-[#8A49DC]" />
        </div>
        <div className="mt-2">
          <p className="text-sm font-semibold text-[#E9E6EB]">Mini-League Total</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black text-[#8A49DC]">{totalChipsUsed}</span>
            <span className="text-xs text-[#A28DA6] font-medium">chips activated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
