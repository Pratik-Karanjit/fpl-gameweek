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
      <div className="w-full max-w-7xl mx-auto mb-8 p-8 rounded-2xl glass-panel text-center border border-[#54245A]">
        <p className="text-[#A28DA6] text-sm">
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
            <Users className="w-5 h-5 text-[#0BE6FF]" />
            <span>Your Joined Mini-Leagues</span>
          </h3>
          <p className="text-xs text-[#A28DA6]">
            Compare live Gameweek leaderboard ranks across leagues, or click any card for full historical analytics.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#37003C] border border-[#54245A] text-[#0BE6FF]">
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
              className={`group text-left p-5 rounded-2xl transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-[#37003C] border-2 border-[#0BE6FF] shadow-xl shadow-[#0BE6FF]/20 ring-1 ring-[#0BE6FF]/50"
                  : "bg-[#28002B] border border-[#54245A] hover:bg-[#37003C]/80 hover:border-[#8A49DC]"
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-[#0BE6FF] bg-[#1F0022] px-2.5 py-0.5 rounded-full border border-[#0BE6FF]/50 shadow-sm">
                  <CheckCircle className="w-3 h-3 text-[#0BE6FF]" />
                  <span>Viewing</span>
                </div>
              )}

              {/* League Header */}
              <div className="pr-16 mb-4">
                <h4 className="text-base font-bold text-white group-hover:text-[#0BE6FF] transition-colors line-clamp-1">
                  {league.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#A28DA6] font-mono">
                    ID #{league.id}
                  </span>
                  {totalManagersCount && (
                    <>
                      <span className="text-[#54245A]">•</span>
                      <span className="text-xs text-[#E9E6EB] font-medium">
                        {new Intl.NumberFormat().format(totalManagersCount)} Managers
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Two Stat Tiles: GW Leaderboard Rank & Overall Rank */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {/* 1. GAMEWEEK LEADERBOARD RANK */}
                <div className="p-3 rounded-xl bg-[#1F0022] border border-[#54245A] relative overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#0BE6FF] mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#0BE6FF]" />
                      GW {summary?.gw ? `${summary.gw}` : ""} Rank
                    </span>
                    {summary?.manager_gw_rank === 1 && (
                      <Crown className="w-3.5 h-3.5 text-[#35B9FB]" />
                    )}
                  </div>

                  {isLoadingGwRanks && !hasSummary ? (
                    <div className="py-2">
                      <div className="h-5 w-16 bg-[#37003C] rounded animate-pulse mb-1.5" />
                      <div className="h-3 w-20 bg-[#37003C]/60 rounded animate-pulse" />
                    </div>
                  ) : hasSummary ? (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-white">
                          #{summary.manager_gw_rank}
                          {summary.is_approximate ? "+" : ""}
                        </span>
                        {totalManagersCount && (
                          <span className="text-[11px] text-[#A28DA6] truncate max-w-[80px]">
                            of {new Intl.NumberFormat().format(totalManagersCount)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className="font-bold text-[#0BE6FF]">
                          {summary.manager_gw_points} pts
                        </span>
                        {summary.manager_gw_rank === 1 && !summary.is_approximate ? (
                          <span className="text-[10px] font-bold text-[#35B9FB] bg-[#37003C] px-1.5 py-0.2 rounded border border-[#35B9FB]/40">
                            👑 Top Score!
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#A28DA6]">
                            High: {summary.league_gw_high}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-[11px] text-[#A28DA6]">
                      <span>Click to load</span>
                    </div>
                  )}
                </div>

                {/* 2. OVERALL SEASON RANK */}
                <div className="p-3 rounded-xl bg-[#1F0022] border border-[#54245A]">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#A28DA6] mb-1">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#8A49DC]" />
                      Overall Rank
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-white">
                      {overallRank ? `#${new Intl.NumberFormat().format(overallRank)}` : "-"}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#A28DA6] mt-1 font-medium truncate">
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
              <div className="pt-2 border-t border-[#54245A]/60 flex items-center justify-between text-xs">
                <span className="text-[#A28DA6] text-[11px]">
                  {hasSummary && summary.league_gw_avg
                    ? `League Avg: ${summary.league_gw_avg} pts`
                    : "Deep Standings & Chips"}
                </span>
                <span className="font-bold text-[#0BE6FF] group-hover:text-[#35B9FB] group-hover:translate-x-1 transition-all flex items-center gap-0.5">
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
