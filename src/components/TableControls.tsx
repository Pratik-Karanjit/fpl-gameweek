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
    <div className="w-full rounded-2xl bg-white p-5 border border-gray-200 mb-6 space-y-4 shadow-sm">
      {/* Top Bar: Search & Gameweek Selector */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by manager name or team name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#37003C] focus:border-[#37003C] transition"
          />
        </div>

        {/* Gameweek Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
            Gameweek:
          </span>
          <select
            value={selectedGw}
            onChange={(e) => onSelectGw(Number(e.target.value))}
            className="bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-[#37003C] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#37003C]"
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
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">
            Sort by:
          </span>
          <select
            value={sortField}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-800 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#37003C]"
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
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#37003C]" />
            <span>Chips:</span>
          </span>

          <button
            onClick={() => onChipFilterChange("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeChipFilter === "all"
                ? "bg-[#37003C] text-white shadow-sm shadow-purple-950/20"
                : "bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            All Managers
          </button>

          <button
            onClick={() => onChipFilterChange("wildcard")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "wildcard"
                ? "bg-[#F3E8F5] border-[#37003C] text-[#37003C]"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Wildcard
          </button>

          <button
            onClick={() => onChipFilterChange("freehit")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "freehit"
                ? "bg-amber-50 border-amber-500 text-amber-800"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Free Hit
          </button>

          <button
            onClick={() => onChipFilterChange("bboost")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "bboost"
                ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Bench Boost
          </button>

          <button
            onClick={() => onChipFilterChange("3xc")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "3xc"
                ? "bg-cyan-50 border-cyan-500 text-cyan-800"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Triple Captain
          </button>

          <button
            onClick={() => onChipFilterChange("none")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeChipFilter === "none"
                ? "bg-gray-200 border-gray-400 text-gray-900"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            No Chips Used
          </button>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Showing <strong className="text-gray-900 font-bold">{totalFilteredCount}</strong> of{" "}
            {totalOriginalCount} managers
          </span>

          {(searchQuery || activeChipFilter !== "all" || sortField !== "total_points") && (
            <button
              onClick={onResetFilters}
              className="text-xs font-bold text-[#37003C] hover:text-[#5F3290] flex items-center gap-1 transition"
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
