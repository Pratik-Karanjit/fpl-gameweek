"use client";

import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";

export type SortField =
  | "total_points"
  | "selected_gw_points"
  | "net_gw_points"
  | "team_value"
  | "bank"
  | "total_budget"
  | "bench_points";

export type ChipFilter = "all" | "wildcard" | "freehit" | "bboost" | "3xc" | "none";

interface TableControlsProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedGw: number;
  onSelectGw: (gw: number) => void;
  availableGws: number[];
  activeChipFilter: ChipFilter;
  onChipFilterChange: (chip: ChipFilter) => void;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSortChange: (field: SortField) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalOriginalCount: number;
}

export const TableControls: React.FC<TableControlsProps> = ({
  searchQuery,
  onSearchChange,
  selectedGw,
  onSelectGw,
  availableGws,
  activeChipFilter,
  onChipFilterChange,
  sortField,
  sortDirection,
  onSortChange,
  onResetFilters,
  totalFilteredCount,
  totalOriginalCount,
}) => {
  return (
    <div className="w-full rounded-2xl bg-[#37003C]/95 p-5 border border-[#6F2E77] mb-6 space-y-4 shadow-xl">
      {/* Top Bar: Search & Gameweek Selector */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A28DA6]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by manager name or team name..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#28002E] border border-[#6F2E77] rounded-xl text-sm text-white placeholder-[#A28DA6]/60 focus:outline-none focus:ring-2 focus:ring-[#0BE6FF]/60 focus:border-[#0BE6FF] transition"
          />
        </div>

        {/* Gameweek Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#A28DA6] whitespace-nowrap">
            Gameweek:
          </span>
          <select
            value={selectedGw}
            onChange={(e) => onSelectGw(Number(e.target.value))}
            className="bg-[#480050] border border-[#6F2E77] rounded-xl text-sm font-bold text-[#0BE6FF] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0BE6FF]/60"
          >
            {availableGws.map((gw) => (
              <option key={gw} value={gw}>
                Gameweek {gw}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector Dropdown for mobile/tablet */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#A28DA6] whitespace-nowrap">
            Sort by:
          </span>
          <select
            value={sortField}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="bg-[#480050] border border-[#6F2E77] rounded-xl text-sm font-semibold text-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#8A49DC]/60"
          >
            <option value="total_points">Total Points</option>
            <option value="selected_gw_points">GW {selectedGw} Points</option>
            <option value="net_gw_points">Net GW Points (minus hits)</option>
            <option value="team_value">Team Value</option>
            <option value="bank">Bank Balance</option>
            <option value="total_budget">Total Budget (Squad + Bank)</option>
            <option value="bench_points">Bench Points</option>
          </select>
        </div>
      </div>

      {/* Bottom Bar: Chip Filters & Results Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#6F2E77]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#A28DA6] flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#0BE6FF]" />
            <span>Chips:</span>
          </span>

          <button
            onClick={() => onChipFilterChange("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeChipFilter === "all"
                ? "bg-[#0BE6FF] text-[#1F0022] shadow-sm shadow-[#0BE6FF]/30"
                : "bg-[#480050] border border-[#6F2E77] text-[#A28DA6] hover:text-white"
            }`}
          >
            All Managers
          </button>

          <button
            onClick={() => onChipFilterChange("wildcard")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "wildcard"
                ? "bg-[#8A49DC]/25 border-[#8A49DC] text-[#8A49DC]"
                : "border-[#6F2E77] bg-[#480050] text-[#A28DA6] hover:text-white"
            }`}
          >
            Wildcard
          </button>

          <button
            onClick={() => onChipFilterChange("freehit")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "freehit"
                ? "bg-[#35B9FB]/25 border-[#35B9FB] text-[#35B9FB]"
                : "border-[#6F2E77] bg-[#480050] text-[#A28DA6] hover:text-white"
            }`}
          >
            Free Hit
          </button>

          <button
            onClick={() => onChipFilterChange("bboost")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "bboost"
                ? "bg-[#6A72F6]/25 border-[#6A72F6] text-[#6A72F6]"
                : "border-[#6F2E77] bg-[#480050] text-[#A28DA6] hover:text-white"
            }`}
          >
            Bench Boost
          </button>

          <button
            onClick={() => onChipFilterChange("3xc")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "3xc"
                ? "bg-[#0BE6FF]/25 border-[#0BE6FF] text-[#0BE6FF]"
                : "border-[#6F2E77] bg-[#480050] text-[#A28DA6] hover:text-white"
            }`}
          >
            Triple Captain
          </button>

          <button
            onClick={() => onChipFilterChange("none")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "none"
                ? "bg-white/20 border-white text-white"
                : "border-[#6F2E77] bg-[#480050] text-[#A28DA6] hover:text-white"
            }`}
          >
            No Chips Used
          </button>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A28DA6]">
            Showing <strong className="text-white font-bold">{totalFilteredCount}</strong> of{" "}
            {totalOriginalCount} managers
          </span>

          {(searchQuery || activeChipFilter !== "all" || sortField !== "total_points") && (
            <button
              onClick={onResetFilters}
              className="text-xs font-semibold text-[#0BE6FF] hover:text-[#35B9FB] flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
