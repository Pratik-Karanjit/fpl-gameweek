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
    <div className="w-full">
      <div className="rounded-2xl bg-white p-5 sm:p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Manager Header Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#37003C] shadow-md shadow-purple-950/15 flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#37003C] tracking-tight">
                {profile.name}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-[#F3E8F5] text-[#37003C] border border-[#D8C5DF] font-mono font-bold">
                ID #{profile.id}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="font-semibold text-gray-800">
                {profile.player_first_name} {profile.player_last_name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#37003C]" />
                {profile.player_region_name}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Total Points */}
          <div className="flex-1 sm:flex-initial min-w-[125px] px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E2D5E6]">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Total Points</span>
            </div>
            <div className="text-xl font-black text-[#37003C] mt-0.5">
              {profile.summary_overall_points ?? "-"}
            </div>
          </div>

          {/* Overall Rank */}
          <div className="flex-1 sm:flex-initial min-w-[125px] px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E2D5E6]">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#37003C]" />
              <span>Overall Rank</span>
            </div>
            <div className="text-xl font-black text-gray-900 mt-0.5">
              #{formatRank(profile.summary_overall_rank)}
            </div>
          </div>

          {/* GW Points */}
          <div className="flex-1 sm:flex-initial min-w-[125px] px-4 py-2.5 rounded-xl bg-[#F8F4FA] border border-[#E2D5E6]">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#00BDD6]" />
              <span>Last GW</span>
            </div>
            <div className="text-xl font-black text-[#00A859] mt-0.5">
              {profile.summary_event_points ?? "-"} pts
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition flex items-center justify-center shrink-0"
            title="Switch Manager ID"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
