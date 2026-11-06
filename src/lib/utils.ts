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
    color: "text-[#37003C]",
    bg: "bg-[#F3E8F5]",
    border: "border-[#D8C5DF]",
  },
  freehit: {
    label: "Free Hit",
    short: "FH",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  bboost: {
    label: "Bench Boost",
    short: "BB",
    color: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  "3xc": {
    label: "Triple Captain",
    short: "3xTC",
    color: "text-cyan-800",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
};

export function getChipConfig(chipName: string) {
  const normalized = chipName.toLowerCase();
  return (
    CHIP_CONFIG[normalized] || {
      label: chipName,
      short: chipName.toUpperCase().slice(0, 3),
      color: "text-gray-700",
      bg: "bg-gray-100",
      border: "border-gray-200",
    }
  );
}
