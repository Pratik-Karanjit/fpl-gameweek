"use client";

import React from "react";
import { FPLClassicLeagueItem, LeagueGWSummary } from "@/types/fpl";
import {
  Users,
  ChevronRight,
  CheckCircle,
  Zap,
  Trophy,
  Crown,
  Flame,
} from "lucide-react";

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
  if (!leagues || leagues.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto mb-8 p-8 rounded-2xl glass-panel text-center">
        <p className="text-slate-400 text-sm">
          No classic mini-leagues found for this manager ID.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Your Joined Mini-Leagues</span>
          </h3>
          <p className="text-xs text-slate-400">
            Compare your live Gameweek leaderboard ranks across leagues, or click any card for full historical analytics.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
          {leagues.length} {leagues.length === 1 ? "League" : "Leagues"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leagues.map((league) => {
          const isSelected = selectedLeagueId === league.id;
          const summary = gwSummaries[league.id];
          const hasSummary = Boolean(summary);

          const overallRank = league.entry_rank ?? summary?.manager_overall_rank ?? league.rank;
          const totalManagersCount = league.rank_count || summary?.total_managers;

          return (
            <button
              key={league.id}
              onClick={() => onSelectLeague(league.id)}
              disabled={isLoadingLeague && isSelected}
              className={`group text-left p-5 rounded-2xl transition-all duration-200 relative overflow-hidden border flex flex-col justify-between ${
                isSelected
                  ? "bg-gradient-to-br from-[#2f0738] via-[#200025] to-[#120015] border-emerald-500/60 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                  : "glass-card hover:bg-white/[0.04] border-white/10 hover:border-purple-500/40"
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-sm">
                  <CheckCircle className="w-3 h-3" />
                  <span>Viewing</span>
                </div>
              )}

              {/* League Header */}
              <div className="pr-16 mb-4">
                <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {league.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 font-mono">
                    ID #{league.id}
                  </span>
                  {totalManagersCount && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-300 font-medium">
                        {new Intl.NumberFormat().format(totalManagersCount)} Managers
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Two Stat Tiles: GW Leaderboard Rank & Overall Rank */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {/* 1. GAMEWEEK LEADERBOARD RANK */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      GW {summary?.gw ? `${summary.gw}` : ""} Rank
                    </span>
                    {summary?.manager_gw_rank === 1 && (
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>

                  {isLoadingGwRanks && !hasSummary ? (
                    <div className="py-2">
                      <div className="h-5 w-16 bg-purple-900/60 rounded animate-pulse mb-1.5" />
                      <div className="h-3 w-20 bg-purple-900/40 rounded animate-pulse" />
                    </div>
                  ) : hasSummary ? (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-white">
                          #{summary.manager_gw_rank}
                          {summary.is_approximate ? "+" : ""}
                        </span>
                        {totalManagersCount && (
                          <span className="text-[11px] text-slate-400 truncate max-w-[80px]">
                            of {new Intl.NumberFormat().format(totalManagersCount)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className="font-bold text-emerald-400">
                          {summary.manager_gw_points} pts
                        </span>
                        {summary.manager_gw_rank === 1 && !summary.is_approximate ? (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-1 rounded border border-amber-600/40">
                            👑 Top Score!
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            High: {summary.league_gw_high}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-[11px] text-slate-400">
                      <span>Click to load</span>
                    </div>
                  )}
                </div>

                {/* 2. OVERALL SEASON RANK */}
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      Overall Rank
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-100">
                      {overallRank ? `#${new Intl.NumberFormat().format(overallRank)}` : "-"}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1 font-medium truncate">
                    {summary?.manager_total_points
                      ? `${summary.manager_total_points} pts total`
                      : league.total
                      ? `${league.total} pts total`
                      : totalManagersCount
                      ? `of ${new Intl.NumberFormat().format(totalManagersCount)}`
                      : "Cumulative"}
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {hasSummary && summary.league_gw_avg
                    ? `League Avg: ${summary.league_gw_avg} pts`
                    : "Deep Standings & Chips"}
                </span>
                <span className="font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  <span>Analyze</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
