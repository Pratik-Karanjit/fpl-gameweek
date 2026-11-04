"use client";

import React from "react";
import { AggregatedManagerEntry } from "@/types/fpl";
import { formatMillions, getChipConfig } from "@/lib/utils";
import { SortField } from "./TableControls";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
      <div className="w-full rounded-2xl bg-[#28002B] p-12 text-center border border-[#54245A]">
        <Sparkles className="w-8 h-8 text-[#A28DA6] mx-auto mb-3" />
        <h4 className="text-base font-bold text-white">No managers found</h4>
        <p className="text-xs text-[#A28DA6] mt-1">
          Try adjusting your search query or chip filter.
        </p>
      </div>
    );
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-[#A28DA6] opacity-50 group-hover:opacity-100" />;
    }
    return sortDirection === "desc" ? (
      <ArrowDown className="w-3.5 h-3.5 text-[#0BE6FF]" />
    ) : (
      <ArrowUp className="w-3.5 h-3.5 text-[#0BE6FF]" />
    );
  };

  return (
    <div className="w-full rounded-2xl bg-[#28002B] border border-[#54245A] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#54245A] bg-[#37003C] text-[11px] font-bold uppercase tracking-wider text-[#A28DA6]">
              <th className="py-4 pl-5 pr-2 w-16 text-center">
                <span>Rank</span>
              </th>
              <th className="py-4 px-4 min-w-[200px]">
                <span>Manager / Team</span>
              </th>
              <th
                onClick={() => onSortChange("total_points")}
                className="py-4 px-4 cursor-pointer hover:text-white transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Total Pts</span>
                  {renderSortIcon("total_points")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("selected_gw_points")}
                className="py-4 px-4 cursor-pointer hover:text-white transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>GW {selectedGw} Pts</span>
                  {renderSortIcon("selected_gw_points")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("team_value")}
                className="py-4 px-4 cursor-pointer hover:text-white transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Squad Value</span>
                  {renderSortIcon("team_value")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("bank")}
                className="py-4 px-4 cursor-pointer hover:text-white transition group hidden md:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>In Bank</span>
                  {renderSortIcon("bank")}
                </div>
              </th>
              <th className="py-4 px-4 min-w-[170px]">
                <span>Chips Activated</span>
              </th>
              <th
                onClick={() => onSortChange("bench_points")}
                className="py-4 px-4 cursor-pointer hover:text-white transition group hidden lg:table-cell"
              >
                <div className="flex items-center gap-1.5">
                  <span>Bench Pts</span>
                  {renderSortIcon("bench_points")}
                </div>
              </th>
              <th className="py-4 pr-5 pl-2 text-right">
                <span>Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#54245A]/40 text-sm">
            {entries.map((manager, index) => {
              const dynamicRank = index + 1;
              const isCurrentUser = currentManagerId === manager.entry_id;

              return (
                <tr
                  key={manager.entry_id}
                  onClick={() => onSelectManager(manager)}
                  className={`cursor-pointer transition-colors duration-150 group ${
                    isCurrentUser
                      ? "bg-[#37003C] hover:bg-[#5F3290]/40 border-l-4 border-l-[#0BE6FF]"
                      : "hover:bg-[#37003C]/50"
                  }`}
                >
                  {/* Dynamic Rank Badge */}
                  <td className="py-4 pl-5 pr-2 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      {dynamicRank === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0BE6FF] to-[#35B9FB] text-[#1F0022] font-black text-sm flex items-center justify-center shadow-lg shadow-[#0BE6FF]/30">
                          1
                        </div>
                      ) : dynamicRank === 2 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6A72F6] to-[#35B9FB] text-white font-black text-sm flex items-center justify-center shadow-md">
                          2
                        </div>
                      ) : dynamicRank === 3 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8A49DC] to-[#5F3290] text-white font-black text-sm flex items-center justify-center shadow-md">
                          3
                        </div>
                      ) : (
                        <span className="font-extrabold text-[#E9E6EB] text-sm">
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
                          <span className="font-bold text-white group-hover:text-[#0BE6FF] transition-colors">
                            {manager.team_name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] uppercase font-bold bg-[#0BE6FF]/15 text-[#0BE6FF] px-1.5 py-0.5 rounded border border-[#0BE6FF]/30">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#A28DA6] mt-0.5 flex items-center gap-2">
                          <span>{manager.player_name}</span>
                          <span className="text-[#54245A]">•</span>
                          <span className="font-mono text-[#A28DA6]/80">
                            #{manager.entry_id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total Points */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-base font-extrabold text-white">
                      {manager.total_points}
                    </div>
                    <div className="text-[11px] text-[#A28DA6] font-medium">
                      Orig. #{manager.original_rank}
                    </div>
                  </td>

                  {/* Gameweek Points */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-[#0BE6FF]">
                        {manager.selected_gw_points}
                      </span>
                      <span className="text-xs text-[#A28DA6]">pts</span>
                    </div>
                    {manager.transfers_cost_gw > 0 && (
                      <span className="text-[10px] text-rose-400 font-semibold block">
                        -{manager.transfers_cost_gw} hit ({manager.net_gw_points} net)
                      </span>
                    )}
                  </td>

                  {/* Squad Value */}
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-[#E9E6EB]">
                    <div>{formatMillions(manager.team_value)}</div>
                    <div className="text-[10px] text-[#A28DA6]">
                      Total: {formatMillions(manager.total_budget)}
                    </div>
                  </td>

                  {/* Bank Balance */}
                  <td className="py-4 px-4 whitespace-nowrap text-[#35B9FB] font-semibold hidden md:table-cell">
                    {formatMillions(manager.bank)}
                  </td>

                  {/* Chips Used */}
                  <td className="py-4 px-4">
                    {manager.chips.length === 0 ? (
                      <span className="text-xs text-[#A28DA6] italic">None played</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {manager.chips.map((chip, i) => {
                          const config = getChipConfig(chip.name);
                          return (
                            <span
                              key={i}
                              title={`${config.label} in GW ${chip.event}`}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border ${config.bg} ${config.color} ${config.border}`}
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
                  <td className="py-4 px-4 whitespace-nowrap text-[#A28DA6] hidden lg:table-cell">
                    {manager.bench_points} pts
                  </td>

                  {/* Action Link */}
                  <td className="py-4 pr-5 pl-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-[#37003C] hover:bg-[#0BE6FF]/20 text-[#A28DA6] group-hover:text-[#0BE6FF] transition-colors"
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
