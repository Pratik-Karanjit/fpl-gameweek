export interface FPLGameweek {
  id: number;
  name: string;
  deadline_time: string;
  is_previous: boolean;
  is_current: boolean;
  is_next: boolean;
  finished: boolean;
}

export interface FPLBootstrap {
  events: FPLGameweek[];
  total_players: number;
}

export interface FPLClassicLeagueItem {
  id: number;
  name: string;
  short_name?: string;
  created: string;
  closed: boolean;
  rank: number | null;
  last_rank: number | null;
  rank_sort: number | null;
  entry_rank?: number | null;
  entry_last_rank?: number | null;
  rank_count?: number | null;
  league_type?: string;
  total?: number;
  entry_can_admin: boolean;
  entry_can_invite: boolean;
  has_cup: boolean;
  cup_league?: number | null;
  cup_round?: number | null;
}

export interface FPLManagerProfile {
  id: number;
  player_first_name: string;
  player_last_name: string;
  player_region_name: string;
  player_region_iso_code_short: string;
  summary_overall_points: number;
  summary_overall_rank: number;
  summary_event_points: number;
  summary_event_rank: number;
  current_event: number;
  name: string; // Team name
  joined_time: string;
  leagues: {
    classic: FPLClassicLeagueItem[];
  };
}

export interface FPLLeagueStandingEntry {
  id: number;
  event_total: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number; // Manager ID
  entry_name: string; // Team name
}

export interface FPLChipUsage {
  name: 'wildcard' | 'freehit' | 'bboost' | '3xc' | string;
  time: string;
  event: number;
}

export interface FPLGameweekHistoryItem {
  event: number;
  points: number;
  total_points: number;
  rank: number;
  rank_sort: number;
  overall_rank: number;
  bank: number; // in tenths of £m (e.g. 15 = 1.5m)
  value: number; // in tenths of £m (e.g. 1025 = 102.5m)
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
}

export interface FPLManagerHistoryResponse {
  current: FPLGameweekHistoryItem[];
  chips: FPLChipUsage[];
}

export interface AggregatedManagerEntry {
  entry_id: number;
  player_name: string;
  team_name: string;
  original_rank: number;
  last_rank: number;
  total_points: number;
  event_points: number;
  selected_gw_points: number;
  team_value: number; // converted to millions e.g. 102.4
  bank: number; // converted to millions e.g. 1.2
  total_budget: number; // team_value + bank
  chips: FPLChipUsage[];
  history: FPLGameweekHistoryItem[];
  transfers_cost_gw: number;
  net_gw_points: number;
  bench_points: number;
  // Dynamic rank computed on client based on current filters/sorting:
  dynamic_rank?: number;
}

export interface LeagueGWSummary {
  league_id: number;
  league_name: string;
  total_managers: number;
  gw: number;
  manager_gw_rank: number;
  manager_gw_points: number;
  league_gw_high: number;
  league_gw_avg: number;
  manager_overall_rank: number;
  manager_total_points: number;
  is_approximate?: boolean;
}

export interface LeagueDetailsResponse {
  league: {
    id: number;
    name: string;
    created: string;
    closed: boolean;
    admin_entry: number | null;
  };
  standings: {
    has_next: boolean;
    page: number;
    results: FPLLeagueStandingEntry[];
  };
  current_gameweek: number;
  total_gameweeks: number;
  aggregated_entries: AggregatedManagerEntry[];
}

