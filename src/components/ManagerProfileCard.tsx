"use client";

import React from "react";
import { FPLManagerProfile } from "@/types/fpl";
import { formatRank } from "@/lib/utils";
import { User, Globe, Trophy, Award, Zap, LogOut } from "lucide-react";

interface ManagerProfileCardProps {
  profile: FPLManagerProfile;
  onReset: () => void;
}

export const ManagerProfileCard: React.FC<ManagerProfileCardProps> = ({
  profile,
  onReset,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto mb-8">
      <div className="rounded-2xl glass-panel p-5 sm:p-6 border border-[#6F2E77] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Manager Header Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8A49DC] via-[#5F3290] to-[#0BE6FF] p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-[#37003C] rounded-[14px] flex items-center justify-center">
              <User className="w-7 h-7 text-[#0BE6FF]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {profile.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#480050] text-[#0BE6FF] border border-[#6F2E77] font-mono font-bold">
                ID #{profile.id}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#A28DA6]">
              <span className="font-semibold text-white">
                {profile.player_first_name} {profile.player_last_name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#0BE6FF]" />
                {profile.player_region_name}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Total Points */}
          <div className="flex-1 sm:flex-initial min-w-[125px] px-4 py-2.5 rounded-xl bg-[#480050] border border-[#6F2E77] shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A28DA6] font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#35B9FB]" />
              <span>Total Points</span>
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              {profile.summary_overall_points ?? "-"}
            </div>
          </div>

          {/* Overall Rank */}
          <div className="flex-1 sm:flex-initial min-w-[125px] px-4 py-2.5 rounded-xl bg-[#480050] border border-[#6F2E77] shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A28DA6] font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#0BE6FF]" />
              <span>Overall Rank</span>
            </div>
            <div className="text-xl font-black text-[#0BE6FF] mt-0.5">
              #{formatRank(profile.summary_overall_rank)}
            </div>
          </div>

          {/* GW Points */}
          <div className="flex-1 sm:flex-initial min-w-[125px] px-4 py-2.5 rounded-xl bg-[#480050] border border-[#6F2E77] shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A28DA6] font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#8A49DC]" />
              <span>Last GW</span>
            </div>
            <div className="text-xl font-black text-[#35B9FB] mt-0.5">
              {profile.summary_event_points ?? "-"} pts
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="p-3 rounded-xl bg-[#480050] hover:bg-[#5F3290] border border-[#6F2E77] text-[#A28DA6] hover:text-white transition flex items-center justify-center shrink-0"
            title="Switch Manager ID"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
