"use client";

import React, { useState, useMemo } from "react";
import { FPLClassicLeagueItem, LeagueGWSummary } from "@/types/fpl";
import {
  Users,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trophy,
  Zap,
  Crown,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

type LeftTableSortField = "name" | "gw_rank" | "overall_rank" | "managers";
type SortDirection = "asc" | "desc";

interface LeagueSelectorProps {
  leagues: FPLClassicLeagueItem[];
  selectedLeagueId: number | null;
  onSelectLeague: (leagueId: number) => void;
  isLoadingLeague: boolean;
  gwSummaries?: Record<number, LeagueGWSummary>;
  isLoadingGwRanks?: boolean;
}

export const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  leagues,
  selectedLeagueId,
  onSelectLeague,
  isLoadingLeague,
  gwSummaries = {},
  isLoadingGwRanks = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Default sorted alphabetically by League Name as requested
  const [sortField, setSortField] = useState<LeftTableSortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleHeaderSort = (field: LeftTableSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // For ranks and names, default to asc (1st rank first, A-Z first); for managers, default to desc
      setSortDirection(field === "managers" ? "desc" : "asc");
    }
  };

  // Filter and sort leagues
  const processedLeagues = useMemo(() => {
    if (!leagues || leagues.length === 0) return [];

    // 1. Filter by search query (name or ID)
    let filtered = leagues;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (league) =>
          league.name.toLowerCase().includes(q) ||
          String(league.id).includes(q)
      );
    }

    // 2. Sort dynamically
    return [...filtered].sort((a, b) => {
      let valA: string | number = 0;
      let valB: string | number = 0;

      const summaryA = gwSummaries[a.id];
      const summaryB = gwSummaries[b.id];

      switch (sortField) {
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          if (valA < valB) return sortDirection === "asc" ? -1 : 1;
          if (valA > valB) return sortDirection === "asc" ? 1 : -1;
          return 0;

        case "gw_rank":
          valA = summaryA?.manager_gw_rank ?? 9999999;
          valB = summaryB?.manager_gw_rank ?? 9999999;
          break;

        case "overall_rank":
          valA = a.entry_rank ?? summaryA?.manager_overall_rank ?? a.rank ?? 9999999;
          valB = b.entry_rank ?? summaryB?.manager_overall_rank ?? b.rank ?? 9999999;
          break;

        case "managers":
          valA = a.rank_count || summaryA?.total_managers || 0;
          valB = b.rank_count || summaryB?.total_managers || 0;
          break;

        default:
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          if (valA < valB) return sortDirection === "asc" ? -1 : 1;
          if (valA > valB) return sortDirection === "asc" ? 1 : -1;
          return 0;
      }

      const diff = (valA as number) - (valB as number);
      return sortDirection === "asc" ? diff : -diff;
    });
  }, [leagues, searchQuery, sortField, sortDirection, gwSummaries]);

  const renderSortIcon = (field: LeftTableSortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#37003C] font-bold shrink-0 animate-in fade-in duration-150" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#37003C] font-bold shrink-0 animate-in fade-in duration-150" />
    );
  };

  if (!leagues || leagues.length === 0) {
    return (
      <div className="w-full p-6 rounded-2xl bg-white text-center border border-gray-200 shadow-sm">
        <p className="text-gray-500 text-sm">
          No classic mini-leagues found for this manager ID.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* 1. Header with Title & Badge */}
      <div className="p-4 sm:p-4.5 border-b border-gray-100 bg-gradient-to-r from-white to-[#FDFBFE]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#F3E8F5] text-[#37003C] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#37003C] tracking-tight leading-none">
                Mini-Leagues
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Click any row to view full standings
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3E8F5] text-[#37003C] border border-[#D8C5DF]">
            {leagues.length} Total
          </span>
        </div>

        {/* 2. Search Bar (Search by League Name or Code) */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search league name or code (e.g. 170)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#37003C] focus:border-transparent transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Sortable Mini-League Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-270px)] sm:max-h-[calc(100vh-250px)] divide-y divide-gray-100 overscroll-contain">
        <table className="w-full text-left border-collapse text-xs">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 text-gray-600 font-bold select-none text-[11px]">
            <tr>
              {/* League Name Header (Default Alphabetical) */}
              <th
                onClick={() => handleHeaderSort("name")}
                className="py-2.5 px-3 cursor-pointer group hover:bg-gray-100/80 transition-colors"
                title="Sort Alphabetically"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortField === "name" ? "text-[#37003C] font-black" : ""}>
                    League
                  </span>
                  {renderSortIcon("name")}
                </div>
              </th>

              {/* GW Rank Header */}
              <th
                onClick={() => handleHeaderSort("gw_rank")}
                className="py-2.5 px-2.5 text-center cursor-pointer group hover:bg-gray-100/80 transition-colors whitespace-nowrap"
                title="Sort by Gameweek Rank"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className={sortField === "gw_rank" ? "text-[#37003C] font-black" : ""}>
                    GW Rank
                  </span>
                  {renderSortIcon("gw_rank")}
                </div>
              </th>

              {/* Overall Rank Header */}
              <th
                onClick={() => handleHeaderSort("overall_rank")}
                className="py-2.5 px-2.5 text-center cursor-pointer group hover:bg-gray-100/80 transition-colors whitespace-nowrap"
                title="Sort by Overall Rank"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className={sortField === "overall_rank" ? "text-[#37003C] font-black" : ""}>
                    Overall
                  </span>
                  {renderSortIcon("overall_rank")}
                </div>
              </th>

              {/* Action column (arrow icon) */}
              <th className="py-2.5 pr-3 pl-1 w-6" />
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100/80 bg-white">
            {processedLeagues.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400">
                  <Users className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                  <p className="font-semibold text-xs text-gray-600">No leagues found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    No results match &ldquo;{searchQuery}&rdquo;
                  </p>
                </td>
              </tr>
            ) : (
              processedLeagues.map((league) => {
                const isSelected = selectedLeagueId === league.id;
                const summary = gwSummaries[league.id];
                const hasSummary = Boolean(summary);

                const overallRank =
                  league.entry_rank ?? summary?.manager_overall_rank ?? league.rank;
                const totalManagersCount =
                  league.rank_count || summary?.total_managers;

                return (
                  <tr
                    key={league.id}
                    onClick={() => onSelectLeague(league.id)}
                    className={`cursor-pointer transition-all duration-150 group relative ${
                      isSelected
                        ? "bg-[#37003C] text-white hover:bg-[#45004B]"
                        : "hover:bg-purple-50/60 text-gray-900"
                    }`}
                  >
                    {/* Column 1: League Name & ID / Managers */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {/* Active Indicator dot */}
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold text-xs truncate max-w-[150px] sm:max-w-[180px] xl:max-w-[190px] block ${
                                isSelected
                                  ? "text-white"
                                  : "text-gray-900 group-hover:text-[#37003C]"
                              }`}
                              title={league.name}
                            >
                              {league.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                            <span
                              className={`font-mono ${
                                isSelected ? "text-purple-200" : "text-gray-400"
                              }`}
                            >
                              #{league.id}
                            </span>
                            {totalManagersCount && (
                              <>
                                <span className={isSelected ? "text-purple-400" : "text-gray-300"}>
                                  •
                                </span>
                                <span
                                  className={
                                    isSelected ? "text-purple-200 font-medium" : "text-gray-500"
                                  }
                                >
                                  {new Intl.NumberFormat().format(totalManagersCount)} mgrs
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: GW Rank & Points */}
                    <td className="py-3 px-2.5 text-center whitespace-nowrap">
                      {hasSummary ? (
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-black text-xs flex items-center gap-0.5 ${
                              isSelected
                                ? "text-[#00FF87]"
                                : summary.manager_gw_rank === 1
                                ? "text-amber-600 font-black"
                                : "text-[#37003C]"
                            }`}
                          >
                            {summary.manager_gw_rank === 1 && (
                              <Crown className="w-3 h-3 text-amber-400 shrink-0 inline" />
                            )}
                            #{summary.manager_gw_rank}
                            {summary.is_approximate ? "+" : ""}
                          </span>
                          <span
                            className={`text-[10px] font-bold mt-0.5 ${
                              isSelected ? "text-purple-200" : "text-[#00A859]"
                            }`}
                          >
                            {summary.manager_gw_points} pts
                          </span>
                        </div>
                      ) : isLoadingGwRanks ? (
                        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse mx-auto" />
                      ) : (
                        <span className={`text-[11px] ${isSelected ? "text-purple-300" : "text-gray-400"}`}>
                          -
                        </span>
                      )}
                    </td>

                    {/* Column 3: Overall Rank */}
                    <td className="py-3 px-2.5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-bold text-xs ${
                            isSelected ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {overallRank
                            ? `#${new Intl.NumberFormat().format(overallRank)}`
                            : "-"}
                        </span>
                        <span
                          className={`text-[10px] mt-0.5 ${
                            isSelected ? "text-purple-300" : "text-gray-400"
                          }`}
                        >
                          {summary?.manager_total_points
                            ? `${summary.manager_total_points} pts`
                            : league.total
                            ? `${league.total} pts`
                            : "Total"}
                        </span>
                      </div>
                    </td>

                    {/* Column 4: Selection Arrow */}
                    <td className="py-3 pr-2.5 pl-0 text-right">
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#37003C] group-hover:translate-x-0.5 transition-all shrink-0" />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Table Footer */}
      <div className="px-3.5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
        <span>
          Showing {processedLeagues.length} of {leagues.length} leagues
        </span>
        <span className="text-[10px] text-gray-400 font-mono">
          Sorted: {sortField.toUpperCase()} ({sortDirection.toUpperCase()})
        </span>
      </div>
    </div>
  );
};
