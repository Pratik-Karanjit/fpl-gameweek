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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl glass-panel border border-purple-500/30 shadow-2xl bg-[#17051d] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-purple-800/40 flex items-start justify-between bg-[#200829]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Mini-League Rank #{manager.original_rank}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Entry #{manager.entry_id}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              {manager.team_name}
            </h3>
            <p className="text-sm text-slate-300 font-medium">
              Managed by <span className="text-white">{manager.player_name}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manager Snapshot Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-black/20 border-b border-purple-900/30">
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Points
            </span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">
              {manager.total_points}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Team Value + Bank
            </span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              {formatMillions(manager.total_budget)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Transfer Hits Incurred
            </span>
            <span className="text-xl font-black text-rose-400 mt-0.5 block">
              -{totalTransferHits} pts
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Bench Points
            </span>
            <span className="text-xl font-black text-cyan-400 mt-0.5 block">
              {totalBenchPoints} pts
            </span>
          </div>
        </div>

        {/* Chips Used Row */}
        {manager.chips.length > 0 && (
          <div className="px-6 py-3 bg-[#1d0b24] border-b border-purple-900/30 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Chips History:</span>
            <div className="flex flex-wrap gap-2">
              {manager.chips.map((chip, i) => {
                const config = getChipConfig(chip.name);
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${config.bg} ${config.color} ${config.border}`}
                  >
                    <span>{config.label}</span>
                    <span className="opacity-80 font-normal">Gameweek {chip.event}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Gameweek by Gameweek History Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Gameweek Progression</span>
          </h4>

          {manager.history.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No gameweek history available.</p>
          ) : (
            <div className="rounded-xl border border-purple-800/40 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-purple-950/70 border-b border-purple-800/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-3">GW</th>
                    <th className="py-2.5 px-3">Points</th>
                    <th className="py-2.5 px-3">Transfers (Cost)</th>
                    <th className="py-2.5 px-3">Bench Pts</th>
                    <th className="py-2.5 px-3">Total Pts</th>
                    <th className="py-2.5 px-3">Squad Value</th>
                    <th className="py-2.5 px-3">Overall Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/20">
                  {manager.history.map((gw) => (
                    <tr key={gw.event} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-bold text-white">GW {gw.event}</td>
                      <td className="py-2.5 px-3 font-black text-emerald-400 text-sm">
                        {gw.points}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {gw.event_transfers} tx
                        {gw.event_transfers_cost > 0 && (
                          <span className="text-rose-400 font-bold ml-1">
                            (-{gw.event_transfers_cost})
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{gw.points_on_bench}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-300">
                        {gw.total_points}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {formatMillions(gw.value / 10)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        #{formatRank(gw.overall_rank)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

