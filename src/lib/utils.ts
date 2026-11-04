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
    color: "text-[#8A49DC]",
    bg: "bg-[#8A49DC]/15",
    border: "border-[#8A49DC]/50",
  },
  freehit: {
    label: "Free Hit",
    short: "FH",
    color: "text-[#35B9FB]",
    bg: "bg-[#35B9FB]/15",
    border: "border-[#35B9FB]/50",
  },
  bboost: {
    label: "Bench Boost",
    short: "BB",
    color: "text-[#6A72F6]",
    bg: "bg-[#6A72F6]/15",
    border: "border-[#6A72F6]/50",
  },
  "3xc": {
    label: "Triple Captain",
    short: "3xTC",
    color: "text-[#0BE6FF]",
    bg: "bg-[#0BE6FF]/15",
    border: "border-[#0BE6FF]/50",
  },
};

export function getChipConfig(chipName: string) {
  const normalized = chipName.toLowerCase();
  return (
    CHIP_CONFIG[normalized] || {
      label: chipName,
      short: chipName.toUpperCase().slice(0, 3),
      color: "text-[#E9E6EB]",
      bg: "bg-[#37003C]",
      border: "border-[#54245A]",
    }
  );
}
