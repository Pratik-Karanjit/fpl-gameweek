"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { ManagerInput } from "@/components/ManagerInput";
import { ManagerProfileCard } from "@/components/ManagerProfileCard";
import { LeagueSelector } from "@/components/LeagueSelector";
import { LeagueSummaryCards } from "@/components/LeagueSummaryCards";
import { TableControls, SortField, ChipFilter } from "@/components/TableControls";
import { DynamicRankingTable } from "@/components/DynamicRankingTable";
import { ManagerDetailModal } from "@/components/ManagerDetailModal";
import { WinnerCardModal, WinnerCardData } from "@/components/WinnerCardModal";
import {
  FPLManagerProfile,
  LeagueDetailsResponse,
  AggregatedManagerEntry,
  LeagueGWSummary,
} from "@/types/fpl";
import { Trophy, AlertCircle, Info } from "lucide-react";

export default function Home() {
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [managerId, setManagerId] = useState<number | null>(null);
  const [managerProfile, setManagerProfile] = useState<FPLManagerProfile | null>(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetailsResponse | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isLoadingLeague, setIsLoadingLeague] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [leagueError, setLeagueError] = useState<string | null>(null);

  // Gameweek leaderboard ranks across leagues
  const [leaguesGwSummaries, setLeaguesGwSummaries] = useState<Record<number, LeagueGWSummary>>({});
  const [isLoadingGwRanks, setIsLoadingGwRanks] = useState<boolean>(false);

  // Table filtering and dynamic ranking states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGw, setSelectedGw] = useState<number>(10);
  const [activeChipFilter, setActiveChipFilter] = useState<ChipFilter>("all");
  const [sortField, setSortField] = useState<SortField>("total_points");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Modal inspection states
  const [modalManager, setModalManager] = useState<AggregatedManagerEntry | null>(null);
  const [winnerCardData, setWinnerCardData] = useState<WinnerCardData | null>(null);

  // 1b. Fetch Gameweek ranks across all joined mini-leagues
  const fetchLeaguesGWRanks = useCallback(async (id: number, useDemoData = isDemo, forceRefresh = false) => {
    setIsLoadingGwRanks(true);
    try {
      const url = `/api/fpl/manager/${id}/leagues-gw?${useDemoData ? "mock=true&" : ""}${forceRefresh ? "fresh=true" : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLeaguesGwSummaries(data);
      }
    } catch (err) {
      console.warn("Could not load leagues GW summaries:", err);
    } finally {
      setIsLoadingGwRanks(false);
    }
  }, [isDemo]);

  // 2. Fetch League Standings & Granular Aggregation
  const fetchLeague = useCallback(async (leagueId: number, useDemoData = isDemo, forceRefresh = false) => {
    setSelectedLeagueId(leagueId);
    setIsLoadingLeague(true);
    setLeagueError(null);

    try {
      const url = `/api/fpl/league/${leagueId}?${useDemoData ? "mock=true&" : ""}${forceRefresh ? "fresh=true" : ""}`;
      const res = await fetch(url);
      const data: LeagueDetailsResponse = await res.json();

      if (!res.ok) {
        throw new Error((data as unknown as { error?: string }).error || `Failed to fetch league #${leagueId}`);
      }

      setLeagueDetails(data);
      if (data.current_gameweek) {
        setSelectedGw(data.current_gameweek);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error aggregating league data";
      setLeagueError(message);
    } finally {
      setIsLoadingLeague(false);
    }
  }, [isDemo]);

  // 1. Fetch Manager Profile & Leagues
  const fetchManager = useCallback(async (id: number, useDemoData = isDemo) => {
    setIsLoadingProfile(true);
    setProfileError(null);
    setSelectedLeagueId(null);
    setLeagueDetails(null);

    try {
      const url = `/api/fpl/manager/${id}${useDemoData ? "?mock=true" : ""}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Failed to fetch manager #${id}`);
      }

      setManagerId(id);
      setManagerProfile(data);

      // Kick off Gameweek leaderboard rank calculation for all joined leagues
      fetchLeaguesGWRanks(id, useDemoData);

      // Auto-select first classic league if present
      if (data.leagues?.classic && data.leagues.classic.length > 0) {
        const firstLeague = data.leagues.classic[0];
        fetchLeague(firstLeague.id, useDemoData);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error connecting to FPL API";
      setProfileError(message);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [isDemo, fetchLeague, fetchLeaguesGWRanks]);

  // Toggle demo mode
  const handleToggleDemo = (enabled: boolean) => {
    setIsDemo(enabled);
    if (enabled) {
      fetchManager(1042318, true);
    } else if (managerId) {
      fetchManager(managerId, false);
    }
  };

  const handleResetManager = () => {
    setManagerId(null);
    setManagerProfile(null);
    setSelectedLeagueId(null);
    setLeagueDetails(null);
    setLeaguesGwSummaries({});
    setIsLoadingProfile(false);
    setIsLoadingLeague(false);
    setIsLoadingGwRanks(false);
    setProfileError(null);
    setLeagueError(null);
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveChipFilter("all");
    setSortField("total_points");
    setSortDirection("desc");
    if (leagueDetails?.current_gameweek) {
      setSelectedGw(leagueDetails.current_gameweek);
    }
  };

  // Available Gameweeks array (1 to current/latest available)
  const availableGws = useMemo(() => {
    const maxGw = leagueDetails?.current_gameweek || 10;
    return Array.from({ length: maxGw }, (_, i) => i + 1);
  }, [leagueDetails?.current_gameweek]);

  // Dynamic ranking and filtering engine
  const processedEntries = useMemo(() => {
    if (!leagueDetails || !leagueDetails.aggregated_entries) return [];

    // 1. Recalculate specific gameweek metrics for the selected GW
    const withGwMetrics = leagueDetails.aggregated_entries.map((entry) => {
      const gwHistoryItem = entry.history?.find((h) => h.event === selectedGw);
      const gwPoints = gwHistoryItem ? gwHistoryItem.points : entry.event_points;
      const gwCost = gwHistoryItem ? gwHistoryItem.event_transfers_cost : entry.transfers_cost_gw;
      const bench = gwHistoryItem ? gwHistoryItem.points_on_bench : entry.bench_points;

      return {
        ...entry,
        selected_gw_points: gwPoints,
        transfers_cost_gw: gwCost,
        net_gw_points: gwPoints - gwCost,
        bench_points: bench,
      };
    });

    // 2. Filter by search query
    let filtered = withGwMetrics;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.player_name.toLowerCase().includes(q) ||
          e.team_name.toLowerCase().includes(q)
      );
    }

    // 3. Filter by Chips played
    if (activeChipFilter !== "all") {
      if (activeChipFilter === "none") {
        filtered = filtered.filter((e) => e.chips.length === 0);
      } else {
        filtered = filtered.filter((e) =>
          e.chips.some(
            (c) => c.name.toLowerCase() === activeChipFilter.toLowerCase()
          )
        );
      }
    }

    // 4. Sort dynamically
    const sorted = [...filtered].sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      switch (sortField) {
        case "total_points":
          valA = a.total_points;
          valB = b.total_points;
          break;
        case "selected_gw_points":
          valA = a.selected_gw_points;
          valB = b.selected_gw_points;
          break;
        case "net_gw_points":
          valA = a.net_gw_points;
          valB = b.net_gw_points;
          break;
        case "team_value":
          valA = a.team_value;
          valB = b.team_value;
          break;
        case "bank":
          valA = a.bank;
          valB = b.bank;
          break;
        case "total_budget":
          valA = a.total_budget;
          valB = b.total_budget;
          break;
        case "bench_points":
          valA = a.bench_points;
          valB = b.bench_points;
          break;
        default:
          valA = a.total_points;
          valB = b.total_points;
      }

      if (valA === valB) {
        return b.total_points - a.total_points;
      }

      return sortDirection === "desc" ? valB - valA : valA - valB;
    });

    return sorted;
  }, [
    leagueDetails,
    selectedGw,
    searchQuery,
    activeChipFilter,
    sortField,
    sortDirection,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar
        currentGameweek={leagueDetails?.current_gameweek ?? 10}
        isDemo={isDemo}
        onToggleDemo={handleToggleDemo}
        onRefresh={() => {
          if (selectedLeagueId) fetchLeague(selectedLeagueId, isDemo, true);
          if (managerId) {
            fetchLeaguesGWRanks(managerId, isDemo, true);
          }
        }}
        isLoading={isLoadingProfile || isLoadingLeague || isLoadingGwRanks}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* If no manager is active yet, show landing hero */}
        {!managerProfile ? (
          <div className="py-8 sm:py-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E8F5] border border-[#D8C5DF] text-[#37003C] text-xs font-bold mb-4 shadow-sm">
                <Trophy className="w-4 h-4 text-[#37003C]" />
                <span>Fantasy Premier League Mini-League Intelligence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-[#37003C] tracking-tight leading-tight">
                Live Dynamic Rankings & Mini-League Analysis
              </h1>
              <p className="text-gray-600 text-base mt-3 leading-relaxed">
                Re-rank any mini-league on the fly by Gameweek points, chip usage, squad budgets, or bank balance. Deep drill-downs into rival manager trajectories.
              </p>
            </div>

            <ManagerInput
              onSearch={(id) => fetchManager(id)}
              isLoading={isLoadingProfile}
              initialId={managerId}
              error={profileError}
            />
          </div>
        ) : (
          <div>
            {/* Manager Profile Header */}
            <ManagerProfileCard
              profile={managerProfile}
              onReset={handleResetManager}
            />

            {/* League Selector Grid */}
            <LeagueSelector
              leagues={managerProfile.leagues?.classic || []}
              selectedLeagueId={selectedLeagueId}
              onSelectLeague={(id) => fetchLeague(id)}
              isLoadingLeague={isLoadingLeague}
              gwSummaries={leaguesGwSummaries}
              isLoadingGwRanks={isLoadingGwRanks}
            />

            {/* Error loading league */}
            {leagueError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-800">
                    Failed to fetch league data
                  </p>
                  <p className="text-xs text-rose-700 mt-0.5">{leagueError}</p>
                </div>
              </div>
            )}

            {/* League Data Section */}
            {isLoadingLeague ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 border-4 border-[#37003C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-bold text-gray-900">
                  Aggregating Mini-League Data...
                </h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Fetching granular gameweek histories, chip usage, and squad valuations for all league entries.
                </p>
              </div>
            ) : leagueDetails ? (
              <div>
                {/* Active League Title Banner */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#37003C] tracking-wider uppercase">
                      Active League Standings
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                      {leagueDetails.league.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700 bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 font-semibold shadow-sm">
                      Season Gameweek {leagueDetails.current_gameweek} of {leagueDetails.total_gameweeks}
                    </span>
                  </div>
                </div>

                {/* Summary Metric Cards (Includes GW Winner Poster Trigger) */}
                <LeagueSummaryCards
                  entries={processedEntries}
                  selectedGw={selectedGw}
                  leagueName={leagueDetails.league.name}
                  onOpenWinnerModal={setWinnerCardData}
                />

                {/* Table Controls (Search, GW select, Chips filter, Sort) */}
                <TableControls
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedGw={selectedGw}
                  onSelectGw={setSelectedGw}
                  availableGws={availableGws}
                  activeChipFilter={activeChipFilter}
                  onChipFilterChange={setActiveChipFilter}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  onResetFilters={handleResetFilters}
                  totalFilteredCount={processedEntries.length}
                  totalOriginalCount={leagueDetails.aggregated_entries.length}
                />

                {/* Dynamic Ranking Table (1..N real-time re-ranking & Winner Card trigger) */}
                <DynamicRankingTable
                  entries={processedEntries}
                  selectedGw={selectedGw}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                  onSelectManager={setModalManager}
                  currentManagerId={managerProfile.id}
                  leagueName={leagueDetails.league.name}
                  onOpenWinnerModal={setWinnerCardData}
                />
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* Manager Gameweek Drill-Down Modal */}
      <ManagerDetailModal
        manager={modalManager}
        onClose={() => setModalManager(null)}
      />

      {/* Gameweek Winner Poster Generator & Export Modal */}
      <WinnerCardModal
        data={winnerCardData}
        onClose={() => setWinnerCardData(null)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FPL League Pulse. Built with Next.js & Tailwind CSS.</p>
          <p className="flex items-center gap-1 text-gray-500">
            <Info className="w-3.5 h-3.5 text-[#37003C]" />
            <span>Connects directly to the public Fantasy Premier League API.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
