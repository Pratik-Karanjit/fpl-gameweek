"use client";

import React from "react";
import { Search, Filter, RotateCcw, ArrowUpDown } from "lucide-react";

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
    <div className="w-full rounded-2xl glass-panel p-5 border border-purple-500/20 mb-6 space-y-4">
      {/* Top Bar: Search & Gameweek Selector */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by manager name or team name..."
            className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
        </div>

        {/* Gameweek Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
            Gameweek:
          </span>
          <select
            value={selectedGw}
            onChange={(e) => onSelectGw(Number(e.target.value))}
            className="bg-[#240c2b] border border-white/10 rounded-xl text-sm font-bold text-emerald-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
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
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
            Sort by:
          </span>
          <select
            value={sortField}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="bg-[#240c2b] border border-white/10 rounded-xl text-sm font-semibold text-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
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
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Chips:</span>
          </span>

          <button
            onClick={() => onChipFilterChange("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              activeChipFilter === "all"
                ? "bg-purple-600 text-white font-bold shadow-sm"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            All Managers
          </button>

          <button
            onClick={() => onChipFilterChange("wildcard")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              activeChipFilter === "wildcard"
                ? "bg-purple-950 border-purple-500 text-purple-200 font-bold"
                : "border-transparent bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Wildcard
          </button>

          <button
            onClick={() => onChipFilterChange("freehit")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              activeChipFilter === "freehit"
                ? "bg-amber-950 border-amber-500 text-amber-200 font-bold"
                : "border-transparent bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Free Hit
          </button>

          <button
            onClick={() => onChipFilterChange("bboost")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              activeChipFilter === "bboost"
                ? "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold"
                : "border-transparent bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Bench Boost
          </button>

          <button
            onClick={() => onChipFilterChange("3xc")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              activeChipFilter === "3xc"
                ? "bg-cyan-950 border-cyan-500 text-cyan-200 font-bold"
                : "border-transparent bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Triple Captain
          </button>

          <button
            onClick={() => onChipFilterChange("none")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              activeChipFilter === "none"
                ? "bg-slate-800 border-slate-600 text-slate-200 font-bold"
                : "border-transparent bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            No Chips Used
          </button>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{totalFilteredCount}</strong> of{" "}
            {totalOriginalCount} managers
          </span>

          {(searchQuery || activeChipFilter !== "all" || sortField !== "total_points") && (
            <button
              onClick={onResetFilters}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
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

