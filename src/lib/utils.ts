import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(tenths: number): string {
  return `£${(tenths / 10).toFixed(1)}m`;
}

export function formatMillions(value: number): string {
  return `£${value.toFixed(1)}m`;
}

export function formatRank(rank: number | undefined | null): string {
  if (!rank || rank === 0) return "-";
  return new Intl.NumberFormat().format(rank);
}

export const CHIP_CONFIG: Record<
  string,
  { label: string; short: string; color: string; bg: string; border: string }
> = {
  wildcard: {
    label: "Wildcard",
    short: "WC",
    color: "text-purple-300",
    bg: "bg-purple-950/70",
    border: "border-purple-600/50",
  },
  freehit: {
    label: "Free Hit",
    short: "FH",
    color: "text-amber-300",
    bg: "bg-amber-950/70",
    border: "border-amber-600/50",
  },
  bboost: {
    label: "Bench Boost",
    short: "BB",
    color: "text-emerald-300",
    bg: "bg-emerald-950/70",
    border: "border-emerald-600/50",
  },
  "3xc": {
    label: "Triple Captain",
    short: "3xTC",
    color: "text-cyan-300",
    bg: "bg-cyan-950/70",
    border: "border-cyan-600/50",
  },
};

export function getChipConfig(chipName: string) {
  const normalized = chipName.toLowerCase();
  return (
    CHIP_CONFIG[normalized] || {
      label: chipName,
      short: chipName.toUpperCase().slice(0, 3),
      color: "text-zinc-300",
      bg: "bg-zinc-800",
      border: "border-zinc-700",
    }
  );
}

