"use client";

import React, { useEffect } from "react";
import { AggregatedManagerEntry } from "@/types/fpl";
import { formatMillions, formatRank, getChipConfig } from "@/lib/utils";
import { X, Trophy, TrendingUp, Award, Zap, Coins, Calendar, ArrowRight } from "lucide-react";

interface ManagerDetailModalProps {
  manager: AggregatedManagerEntry | null;
  onClose: () => void;
}

export const ManagerDetailModal: React.FC<ManagerDetailModalProps> = ({
  manager,
  onClose,
}) => {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!manager) return null;

  const totalTransferHits = manager.history.reduce(
    (acc, item) => acc + item.event_transfers_cost,
    0
  );
  const totalBenchPoints = manager.history.reduce(
    (acc, item) => acc + item.points_on_bench,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#28002B] border border-[#54245A] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#54245A] flex items-start justify-between bg-[#37003C]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#0BE6FF]/15 text-[#0BE6FF] border border-[#0BE6FF]/30">
                Mini-League Rank #{manager.original_rank}
              </span>
              <span className="text-xs text-[#A28DA6] font-mono">
                Entry #{manager.entry_id}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              {manager.team_name}
            </h3>
            <p className="text-sm text-[#A28DA6] font-medium">
              Managed by <span className="text-white font-bold">{manager.player_name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#28002B] hover:bg-[#1F0022] text-[#A28DA6] hover:text-white transition border border-[#54245A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-[#1F0022]/60 border-b border-[#54245A]">
          <div className="p-3 rounded-xl bg-[#37003C] border border-[#54245A]">
            <span className="text-[10px] font-bold text-[#A28DA6] uppercase tracking-wider block">
              Total Points
            </span>
            <span className="text-xl font-black text-[#0BE6FF] mt-0.5 block">
              {manager.total_points}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#37003C] border border-[#54245A]">
            <span className="text-[10px] font-bold text-[#A28DA6] uppercase tracking-wider block">
              Team Value + Bank
            </span>
            <span className="text-xl font-black text-[#35B9FB] mt-0.5 block">
              {formatMillions(manager.total_budget)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#37003C] border border-[#54245A]">
            <span className="text-[10px] font-bold text-[#A28DA6] uppercase tracking-wider block">
              Transfer Hits Incurred
            </span>
            <span className="text-xl font-black text-rose-400 mt-0.5 block">
              -{totalTransferHits} pts
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#37003C] border border-[#54245A]">
            <span className="text-[10px] font-bold text-[#A28DA6] uppercase tracking-wider block">
              Total Bench Points
            </span>
            <span className="text-xl font-black text-[#8A49DC] mt-0.5 block">
              {totalBenchPoints} pts
            </span>
          </div>
        </div>

        {/* Chips Used Banner */}
        <div className="p-4 bg-[#28002B] border-b border-[#54245A] flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[#A28DA6] uppercase tracking-wider">
            Chips Activated:
          </span>
          {manager.chips.length === 0 ? (
            <span className="text-xs text-[#A28DA6] italic">None played so far</span>
          ) : (
            manager.chips.map((chip, idx) => {
              const cfg = getChipConfig(chip.name);
              return (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                >
                  <span>{cfg.label}</span>
                  <span className="text-[10px] opacity-75">GW {chip.event}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Gameweek-by-Gameweek Trajectory Table */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Gameweek History
          </h4>

          <div className="rounded-xl border border-[#54245A] overflow-hidden bg-[#1F0022]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#37003C] border-b border-[#54245A] text-[10px] font-bold uppercase tracking-wider text-[#A28DA6]">
                  <th className="py-2.5 px-3">GW</th>
                  <th className="py-2.5 px-3">Points</th>
                  <th className="py-2.5 px-3">Hit</th>
                  <th className="py-2.5 px-3">Net</th>
                  <th className="py-2.5 px-3">Bench</th>
                  <th className="py-2.5 px-3">Overall Rank</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3">Bank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#54245A]/40 font-medium">
                {[...manager.history]
                  .sort((a, b) => b.event - a.event)
                  .map((item) => {
                    const netPoints = item.points - item.event_transfers_cost;
                    return (
                      <tr key={item.event} className="hover:bg-[#37003C]/50 transition-colors">
                        <td className="py-2 px-3 font-bold text-white">GW {item.event}</td>
                        <td className="py-2 px-3 font-black text-[#0BE6FF]">
                          {item.points}
                        </td>
                        <td className="py-2 px-3">
                          {item.event_transfers_cost > 0 ? (
                            <span className="text-rose-400 font-semibold">
                              -{item.event_transfers_cost}
                            </span>
                          ) : (
                            <span className="text-[#A28DA6]">0</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-bold text-white">{netPoints}</td>
                        <td className="py-2 px-3 text-[#A28DA6]">
                          {item.points_on_bench} pts
                        </td>
                        <td className="py-2 px-3 text-[#E9E6EB]">
                          #{formatRank(item.overall_rank)}
                        </td>
                        <td className="py-2 px-3 text-[#35B9FB]">
                          {formatMillions(item.value / 10)}
                        </td>
                        <td className="py-2 px-3 text-[#A28DA6]">
                          {formatMillions(item.bank / 10)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
