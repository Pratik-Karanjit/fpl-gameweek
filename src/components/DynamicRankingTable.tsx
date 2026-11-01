"use client";

import React from "react";
import { AggregatedManagerEntry } from "@/types/fpl";
import { formatMillions, getChipConfig } from "@/lib/utils";
import { SortField } from "./TableControls";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trophy,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface DynamicRankingTableProps {
  entries: AggregatedManagerEntry[];
  selectedGw: number;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSortChange: (field: SortField) => void;
  onSelectManager: (entry: AggregatedManagerEntry) => void;
  currentManagerId?: number | null;
}

export const DynamicRankingTable: React.FC<DynamicRankingTableProps> = ({
  entries,
  selectedGw,
  sortField,
  sortDirection,
  onSortChange,
  onSelectManager,
  currentManagerId,
}) => {
  if (entries.length === 0) {
    return (
      <div className="w-full rounded-2xl glass-panel p-12 text-center border border-purple-500/20">
        <Sparkles className="w-8 h-8 text-slate-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-200">No managers found</h4>
        <p className="text-xs text-slate-400 mt-1">
          Try adjusting your search query or chip filter.
        </p>
      </div>
    );
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 opacity-50 group-hover:opacity-100" />;
    }
    return sortDirection === "desc" ? (
      <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
    ) : (
      <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
    );
  };

  return (
    <div className="w-full rounded-2xl glass-panel border border-purple-500/20 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-purple-800/40 bg-[#1f0927]/90 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 pl-5 pr-2 w-16 text-center">
                <span>Rank</span>
              </th>
              <th className="py-3.5 px-4 min-w-[200px]">
                <span>Manager / Team</span>
              </th>
              <th
                onClick={() => onSortChange("total_points")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Total Pts</span>
                  {renderSortIcon("total_points")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("selected_gw_points")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>GW {selectedGw} Pts</span>
                  {renderSortIcon("selected_gw_points")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("team_value")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Squad Value</span>
                  {renderSortIcon("team_value")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("bank")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition group hidden md:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>In Bank</span>
                  {renderSortIcon("bank")}
                </div>
              </th>
              <th className="py-3.5 px-4 min-w-[170px]">
                <span>Chips Activated</span>
              </th>
              <th
                onClick={() => onSortChange("bench_points")}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition group hidden lg:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>Bench Pts</span>
                  {renderSortIcon("bench_points")}
                </div>
              </th>
              <th className="py-3.5 pr-5 pl-2 text-right">
                <span>Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20 text-sm">
            {entries.map((manager, index) => {
              const dynamicRank = index + 1;
              const isCurrentUser = currentManagerId === manager.entry_id;

              return (
                <tr
                  key={manager.entry_id}
                  onClick={() => onSelectManager(manager)}
                  className={`cursor-pointer transition-colors duration-150 group ${
                    isCurrentUser
                      ? "bg-emerald-950/20 hover:bg-emerald-900/30"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  {/* Dynamic Rank Badge */}
                  <td className="py-4 pl-5 pr-2 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      {dynamicRank === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/30">
                          1
                        </div>
                      ) : dynamicRank === 2 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                          2
                        </div>
                      ) : dynamicRank === 3 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                          3
                        </div>
                      ) : (
                        <span className="font-extrabold text-slate-300 text-sm">
                          #{dynamicRank}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Manager and Team Details */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {manager.team_name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{manager.player_name}</span>
                          <span className="text-slate-600">•</span>
                          <span className="font-mono text-slate-500">
                            #{manager.entry_id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total Points */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-base font-extrabold text-amber-300">
                      {manager.total_points}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Orig. #{manager.original_rank}
                    </div>
                  </td>

                  {/* Gameweek Points */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-emerald-400">
                        {manager.selected_gw_points}
                      </span>
                      <span className="text-xs text-slate-400">pts</span>
                    </div>
                    {manager.transfers_cost_gw > 0 && (
                      <span className="text-[10px] text-rose-400 font-semibold block">
                        -{manager.transfers_cost_gw} hit ({manager.net_gw_points} net)
                      </span>
                    )}
                  </td>

                  {/* Squad Value */}
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-200">
                    <div>{formatMillions(manager.team_value)}</div>
                    <div className="text-[10px] text-slate-500">
                      Total: {formatMillions(manager.total_budget)}
                    </div>
                  </td>

                  {/* Bank Balance */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-300 hidden md:table-cell">
                    {formatMillions(manager.bank)}
                  </td>

                  {/* Chips Used */}
                  <td className="py-4 px-4">
                    {manager.chips.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">None played</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {manager.chips.map((chip, i) => {
                          const config = getChipConfig(chip.name);
                          return (
                            <span
                              key={i}
                              title={`${config.label} in GW ${chip.event}`}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${config.bg} ${config.color} ${config.border}`}
                            >
                              <span>{config.short}</span>
                              <span className="text-[9px] opacity-75">GW{chip.event}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>

                  {/* Bench Points */}
                  <td className="py-4 px-4 whitespace-nowrap text-slate-400 hidden lg:table-cell">
                    {manager.bench_points} pts
                  </td>

                  {/* Action Link */}
                  <td className="py-4 pr-5 pl-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-300 transition-colors"
                      title="Drill Down Manager History"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

