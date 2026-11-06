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
  Camera,
} from "lucide-react";
import { WinnerCardData } from "./WinnerCardModal";

interface DynamicRankingTableProps {
  entries: AggregatedManagerEntry[];
  selectedGw: number;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSortChange: (field: SortField) => void;
  onSelectManager: (entry: AggregatedManagerEntry) => void;
  currentManagerId?: number | null;
  leagueName?: string;
  onOpenWinnerModal?: (data: WinnerCardData) => void;
}

export const DynamicRankingTable: React.FC<DynamicRankingTableProps> = ({
  entries,
  selectedGw,
  sortField,
  sortDirection,
  onSortChange,
  onSelectManager,
  currentManagerId,
  leagueName = "FPL Mini-League",
  onOpenWinnerModal,
}) => {
  if (entries.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-white p-12 text-center border border-gray-200 shadow-sm">
        <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h4 className="text-base font-bold text-gray-900">No managers found</h4>
        <p className="text-xs text-gray-500 mt-1">
          Try adjusting your search query or chip filter.
        </p>
      </div>
    );
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-white/50 opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === "desc" ? (
      <ArrowDown className="w-3.5 h-3.5 text-[#00FF87]" />
    ) : (
      <ArrowUp className="w-3.5 h-3.5 text-[#00FF87]" />
    );
  };

  return (
    <div className="w-full rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#240027] bg-[#37003C] text-[11px] font-bold uppercase tracking-wider text-white">
              <th className="py-4 pl-5 pr-2 w-16 text-center">
                <span>Rank</span>
              </th>
              <th className="py-4 px-4 min-w-[200px]">
                <span>Manager / Team</span>
              </th>
              <th
                onClick={() => onSortChange("total_points")}
                className="py-4 px-4 cursor-pointer hover:text-white/80 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Total Pts</span>
                  {renderSortIcon("total_points")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("selected_gw_points")}
                className="py-4 px-4 cursor-pointer hover:text-white/80 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>GW {selectedGw} Pts</span>
                  {renderSortIcon("selected_gw_points")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("team_value")}
                className="py-4 px-4 cursor-pointer hover:text-white/80 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Squad Value</span>
                  {renderSortIcon("team_value")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("bank")}
                className="py-4 px-4 cursor-pointer hover:text-white/80 transition group hidden md:table-cell"
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
                className="py-4 px-4 cursor-pointer hover:text-white/80 transition group hidden lg:table-cell"
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
          <tbody className="divide-y divide-gray-100 text-sm">
            {entries.map((manager, index) => {
              const dynamicRank = index + 1;
              const isCurrentUser = currentManagerId === manager.entry_id;

              return (
                <tr
                  key={manager.entry_id}
                  onClick={() => onSelectManager(manager)}
                  className={`cursor-pointer transition-colors duration-150 group ${
                    isCurrentUser
                      ? "bg-[#F6EEF8] hover:bg-[#EFE5F3] border-l-4 border-l-[#37003C]"
                      : "hover:bg-gray-50/80"
                  }`}
                >
                  {/* Dynamic Rank Badge */}
                  <td className="py-4 pl-5 pr-2 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      {dynamicRank === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-[#37003C] text-white font-black text-sm flex items-center justify-center shadow-md">
                          1
                        </div>
                      ) : dynamicRank === 2 ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 font-black text-sm flex items-center justify-center shadow-sm">
                          2
                        </div>
                      ) : dynamicRank === 3 ? (
                        <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                          3
                        </div>
                      ) : (
                        <span className="font-extrabold text-gray-600 text-sm">
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
                          <span className="font-bold text-gray-900 group-hover:text-[#37003C] transition-colors">
                            {manager.team_name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] uppercase font-bold bg-[#37003C] text-white px-2 py-0.5 rounded-md">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <span>{manager.player_name}</span>
                          <span className="text-gray-300">•</span>
                          <span className="font-mono text-gray-400">
                            #{manager.entry_id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total Points */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-base font-extrabold text-gray-900">
                      {manager.total_points}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      Orig. #{manager.original_rank}
                    </div>
                  </td>

                  {/* Gameweek Points */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-[#00A859]">
                        {manager.selected_gw_points}
                      </span>
                      <span className="text-xs text-gray-500">pts</span>
                    </div>
                    {manager.transfers_cost_gw > 0 && (
                      <span className="text-[10px] text-rose-600 font-semibold block">
                        -{manager.transfers_cost_gw} hit ({manager.net_gw_points} net)
                      </span>
                    )}
                  </td>

                  {/* Squad Value */}
                  <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-800">
                    <div>{formatMillions(manager.team_value)}</div>
                    <div className="text-[10px] text-gray-400">
                      Total: {formatMillions(manager.total_budget)}
                    </div>
                  </td>

                  {/* Bank Balance */}
                  <td className="py-4 px-4 whitespace-nowrap text-[#0284C7] font-semibold hidden md:table-cell">
                    {formatMillions(manager.bank)}
                  </td>

                  {/* Chips Used */}
                  <td className="py-4 px-4">
                    {manager.chips.length === 0 ? (
                      <span className="text-xs text-gray-400 italic">None played</span>
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
                  <td className="py-4 px-4 whitespace-nowrap text-gray-600 hidden lg:table-cell">
                    {manager.bench_points} pts
                  </td>

                  {/* Action Link & Create Poster */}
                  <td className="py-4 pr-5 pl-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {onOpenWinnerModal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenWinnerModal({
                              entryId: manager.entry_id,
                              gw: selectedGw,
                              playerName: manager.player_name,
                              teamName: manager.team_name,
                              points: manager.selected_gw_points,
                              leagueName,
                            });
                          }}
                          className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#00A859] text-gray-500 hover:text-white transition-colors"
                          title="Generate GW Winner Card for this Manager"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectManager(manager);
                        }}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#37003C] text-gray-500 hover:text-white transition-colors"
                        title="Drill Down Manager History"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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
