"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, ArrowRight, Sparkles, User, AlertCircle, ChevronDown } from "lucide-react";

const QUICK_PICKS = [
  { label: "Serial Winner", id: 33502 },
  { label: "Focal Haina Local", id: 30102 },
  { label: "Pratik's Team", id: 26479 },
  { label: "Winners FC", id: 7664997 },
  { label: "Harry", id: 3054 },
  { label: "Focal", id: 298 },
  { label: "Raptor", id: 199 },
  { label: "Andy", id: 41 },
];

interface ManagerInputProps {
  onSearch: (managerId: number) => void;
  isLoading: boolean;
  initialId?: number | null;
  error?: string | null;
}

export const ManagerInput: React.FC<ManagerInputProps> = ({
  onSearch,
  isLoading,
  initialId,
  error,
}) => {
  const [managerInput, setManagerInput] = useState<string>(
    initialId ? String(initialId) : ""
  );
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [localValidationMessage, setLocalValidationMessage] = useState<string | null>(null);
  const [showQuickPick, setShowQuickPick] = useState<boolean>(false);
  const quickPickRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickPickRef.current && !quickPickRef.current.contains(e.target as Node)) {
        setShowQuickPick(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const extractManagerId = (raw: string): number | null => {
    const trimmed = raw.trim();
    const urlMatch = trimmed.match(/entry\/(\d+)/i);
    if (urlMatch && urlMatch[1]) {
      return parseInt(urlMatch[1], 10);
    }
    const digits = trimmed.replace(/[^\d]/g, "");
    if (!digits) return null;
    const parsed = parseInt(digits, 10);
    return isNaN(parsed) || parsed <= 0 ? null : parsed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationMessage(null);
    const parsed = extractManagerId(managerInput);
    if (!parsed) {
      setLocalValidationMessage("Please enter a valid Manager ID (e.g. 30102 or 1042318).");
      return;
    }
    onSearch(parsed);
  };

  const handleUseDemo = () => {
    setManagerInput("1042318");
    setLocalValidationMessage(null);
    onSearch(1042318);
  };

  const handleQuickPick = (id: number) => {
    setManagerInput(String(id));
    setLocalValidationMessage(null);
    setShowQuickPick(false);
    onSearch(id);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative rounded-2xl glass-panel p-6 sm:p-8 shadow-2xl border border-[#6F2E77]">
        {/* Subtle decorative gradient background glow using Cyan and Violet */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#0BE6FF]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#8A49DC]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0BE6FF]/20 text-[#0BE6FF] border border-[#0BE6FF]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0BE6FF] animate-ping" />
                  Official Premier League FPL Sync
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Enter Your Manager ID
              </h2>
              <p className="text-[#A28DA6] text-sm mt-1">
                Pull all joined mini-leagues, aggregate manager histories, and dynamically re-rank.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#480050] hover:bg-[#5F3290] border border-[#6F2E77] text-white transition group self-start sm:self-center shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0BE6FF] group-hover:rotate-12 transition-transform" />
              <span>Use Sample Manager (#1042318)</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            {/* Quick Pick Dropdown */}
            <div className="relative" ref={quickPickRef}>
              <button
                type="button"
                onClick={() => setShowQuickPick((v) => !v)}
                disabled={isLoading}
                className="h-full px-4 py-3.5 rounded-xl font-semibold text-sm bg-[#480050] hover:bg-[#5F3290] border border-[#6F2E77] text-white flex items-center gap-2 transition whitespace-nowrap disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0BE6FF]" />
                <span>Quick Pick</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#A28DA6] transition-transform ${showQuickPick ? "rotate-180" : ""}`} />
              </button>

              {showQuickPick && (
                <div className="absolute top-full left-0 mt-1.5 z-50 w-56 rounded-xl bg-[#37003C] border border-[#6F2E77] shadow-2xl shadow-black/80 overflow-y-auto overscroll-contain max-h-72 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#A28DA6] border-b border-[#6F2E77]">
                    Saved Accounts
                  </div>
                  {QUICK_PICKS.map((pick) => (
                    <button
                      key={pick.id}
                      type="button"
                      onClick={() => handleQuickPick(pick.id)}
                      className="w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-[#480050] text-[#E9E6EB] text-sm transition-colors group"
                    >
                      <span className="font-semibold text-white group-hover:text-[#0BE6FF] transition-colors">
                        {pick.label}
                      </span>
                      <span className="text-xs text-[#A28DA6] font-mono group-hover:text-white">
                        #{pick.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A28DA6]">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter Manager ID (e.g. 30102 or 1042318)"
                value={managerInput}
                onChange={(e) => {
                  setManagerInput(e.target.value);
                  if (localValidationMessage) setLocalValidationMessage(null);
                }}
                className="w-full pl-11 pr-4 py-3.5 bg-[#220027] border border-[#6F2E77] rounded-xl text-white placeholder-[#A28DA6]/60 text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#0BE6FF]/60 focus:border-[#0BE6FF] transition"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-[#0BE6FF] via-[#35B9FB] to-[#6A72F6] hover:brightness-110 text-[#1F0022] flex items-center justify-center gap-2 shadow-lg shadow-[#0BE6FF]/30 disabled:opacity-50 transition duration-150 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1F0022] border-t-transparent rounded-full animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <span>Load Mini-Leagues</span>
                  <ArrowRight className="w-4 h-4 text-[#1F0022]" />
                </>
              )}
            </button>
          </form>

          {/* Validation Notice */}
          {localValidationMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#480050] border border-amber-500/50 text-amber-200 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Manager ID Required</p>
                <p className="text-xs text-amber-200/80 mt-0.5">{localValidationMessage}</p>
              </div>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#480050] border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Could not retrieve data</p>
                <p className="text-xs text-rose-200/80 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Help Accordion */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-xs text-[#A28DA6] hover:text-white flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#0BE6FF]" />
              <span>Where do I find my FPL Manager ID?</span>
            </button>

            {showHelp && (
              <div className="mt-2.5 p-4 rounded-xl bg-[#480050]/90 border border-[#6F2E77] text-xs text-[#E9E6EB] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="mb-2 font-semibold text-white">
                  Follow these 2 quick steps:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-[#A28DA6]">
                  <li>
                    Log in to{" "}
                    <a
                      href="https://fantasy.premierleague.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0BE6FF] underline hover:text-[#35B9FB]"
                    >
                      fantasy.premierleague.com
                    </a>{" "}
                    and click on the <strong>Points</strong> tab.
                  </li>
                  <li>
                    Look at your browser URL bar. It will be:{" "}
                    <code className="text-[#0BE6FF] bg-[#220027] px-1.5 py-0.5 rounded border border-[#6F2E77]">
                      fantasy.premierleague.com/entry/
                      <span className="text-[#35B9FB] font-bold">XXXXXX</span>
                      /event/...
                    </code>
                  </li>
                  <li>
                    That number <span className="text-[#35B9FB] font-bold">XXXXXX</span> is your Manager ID!
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
