import {
  FPLBootstrap,
  FPLManagerProfile,
  FPLLeagueStandingEntry,
  FPLManagerHistoryResponse,
  AggregatedManagerEntry,
  LeagueDetailsResponse,
  LeagueGWSummary,
} from "@/types/fpl";

const FPL_BASE = "https://fantasy.premierleague.com/api";

// Simple in-memory cache with TTL (in ms)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

function getCached<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

const COMMON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json",
};

export async function getBootstrapStatic(): Promise<FPLBootstrap> {
  const cacheKey = "fpl_bootstrap";
  const cached = getCached<FPLBootstrap>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${FPL_BASE}/bootstrap-static/`, {
    headers: COMMON_HEADERS,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch FPL bootstrap static: HTTP ${res.status}`);
  }

  const data = (await res.json()) as FPLBootstrap;
  setCache(cacheKey, data);
  return data;
}

export async function getManagerProfile(
  managerId: number
): Promise<FPLManagerProfile> {
  const cacheKey = `fpl_manager_${managerId}`;
  const cached = getCached<FPLManagerProfile>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${FPL_BASE}/entry/${managerId}/`, {
    headers: COMMON_HEADERS,
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Manager ID #${managerId} not found. Please verify the ID.`);
    }
    throw new Error(`FPL API error (HTTP ${res.status}) while fetching manager.`);
  }

  const data = (await res.json()) as FPLManagerProfile;
  setCache(cacheKey, data);
  return data;
}

export async function getEntryHistory(
  entryId: number
): Promise<FPLManagerHistoryResponse> {
  const cacheKey = `fpl_history_${entryId}`;
  const cached = getCached<FPLManagerHistoryResponse>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${FPL_BASE}/entry/${entryId}/history/`, {
    headers: COMMON_HEADERS,
    next: { revalidate: 180 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch history for entry #${entryId}: ${res.status}`);
  }

  const data = (await res.json()) as FPLManagerHistoryResponse;
  setCache(cacheKey, data);
  return data;
}

export async function getLeagueDetails(
  leagueId: number,
  maxPages: number = 10,
  forceRefresh: boolean = false
): Promise<{
  league: { id: number; name: string; created: string; closed: boolean; admin_entry: number | null };
  standings: { has_next: boolean; page: number; results: FPLLeagueStandingEntry[] };
}> {
  const cacheKey = `fpl_league_raw_${leagueId}`;
  if (!forceRefresh) {
    const cached = getCached<{
      league: { id: number; name: string; created: string; closed: boolean; admin_entry: number | null };
      standings: { has_next: boolean; page: number; results: FPLLeagueStandingEntry[] };
    }>(cacheKey);
    if (cached) return cached;
  }

  let currentPage = 1;
  let allResults: FPLLeagueStandingEntry[] = [];
  let leagueMeta: { id: number; name: string; created: string; closed: boolean; admin_entry: number | null } | null = null;
  let hasNext = true;

  while (hasNext && currentPage <= maxPages) {
    const url = `${FPL_BASE}/leagues-classic/${leagueId}/standings/?page_standings=${currentPage}`;
    const res = await fetch(url, {
      headers: COMMON_HEADERS,
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      if (res.status === 404 && currentPage === 1) {
        throw new Error(`League #${leagueId} not found or is private.`);
      }
      break;
    }

    const data = await res.json();
    if (!leagueMeta) {
      leagueMeta = data.league;
    }

    const pageResults: FPLLeagueStandingEntry[] = data.standings?.results || [];
    allResults = allResults.concat(pageResults);

    hasNext = Boolean(data.standings?.has_next) && pageResults.length > 0;
    currentPage++;
  }

  if (!leagueMeta) {
    throw new Error(`League #${leagueId} not found or is private.`);
  }

  const responseData = {
    league: leagueMeta,
    standings: {
      has_next: hasNext,
      page: currentPage - 1,
      results: allResults,
    },
  };

  setCache(cacheKey, responseData);
  return responseData;
}

// Batch helper with concurrency control
async function pMap<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index++;
      try {
        results[currentIndex] = await fn(items[currentIndex]);
      } catch (err) {
        console.error("Batch fetch error on item:", err);
        throw err;
      }
    }
  });

  await Promise.all(workers);
  return results;
}

export async function getAggregatedLeague(
  leagueId: number,
  forceRefresh: boolean = false
): Promise<LeagueDetailsResponse> {
  const cacheKey = `fpl_league_aggregated_${leagueId}`;
  if (!forceRefresh) {
    const cached = getCached<LeagueDetailsResponse>(cacheKey);
    if (cached) return cached;
  }

  // 1. Fetch bootstrap to know current gameweek
  let currentGameweek = 1;
  let totalGameweeks = 38;
  try {
    const bootstrap = await getBootstrapStatic();
    const currentEvent = bootstrap.events.find((e) => e.is_current) ||
      bootstrap.events.find((e) => e.is_next);
    if (currentEvent) {
      currentGameweek = currentEvent.id;
    }
    totalGameweeks = bootstrap.events.length;
  } catch (e) {
    console.warn("Bootstrap fetch warning, defaulting to GW 1:", e);
  }

  // 2. Fetch league standings (with all pages)
  const leagueData = await getLeagueDetails(leagueId, 10, forceRefresh);
  const standingsResults = leagueData.standings.results || [];

  // 3. For all managers in the league, fetch granular history
  const entriesToFetch = standingsResults;

  const aggregatedEntries: AggregatedManagerEntry[] = await pMap(
    entriesToFetch,
    8, // Concurrency 8 for fast, polite parallel fetching
    async (standing) => {
      try {
        const historyData = await getEntryHistory(standing.entry);
        const history = historyData.current || [];
        const chips = historyData.chips || [];

        // Latest GW info
        const latestGw = history.length > 0 ? history[history.length - 1] : null;

        const teamValue = latestGw ? latestGw.value / 10 : 100.0;
        const bank = latestGw ? latestGw.bank / 10 : 0.0;
        const benchPoints = latestGw ? latestGw.points_on_bench : 0;
        const transfersCost = latestGw ? latestGw.event_transfers_cost : 0;
        const eventPoints = standing.event_total || (latestGw ? latestGw.points : 0);

        return {
          entry_id: standing.entry,
          player_name: standing.player_name,
          team_name: standing.entry_name,
          original_rank: standing.rank,
          last_rank: standing.last_rank,
          total_points: standing.total,
          event_points: eventPoints,
          selected_gw_points: eventPoints,
          team_value: teamValue,
          bank: bank,
          total_budget: parseFloat((teamValue + bank).toFixed(1)),
          chips: chips,
          history: history,
          transfers_cost_gw: transfersCost,
          net_gw_points: eventPoints - transfersCost,
          bench_points: benchPoints,
        };
      } catch (err) {
        console.warn(`Failed history for manager ${standing.entry}:`, err);
        // Fallback with data from standings
        return {
          entry_id: standing.entry,
          player_name: standing.player_name,
          team_name: standing.entry_name,
          original_rank: standing.rank,
          last_rank: standing.last_rank,
          total_points: standing.total,
          event_points: standing.event_total || 0,
          selected_gw_points: standing.event_total || 0,
          team_value: 100.0,
          bank: 0.0,
          total_budget: 100.0,
          chips: [],
          history: [],
          transfers_cost_gw: 0,
          net_gw_points: standing.event_total || 0,
          bench_points: 0,
        };
      }
    }
  );

  const response: LeagueDetailsResponse = {
    league: leagueData.league,
    standings: leagueData.standings,
    current_gameweek: currentGameweek,
    total_gameweeks: totalGameweeks,
    aggregated_entries: aggregatedEntries,
  };

  setCache(cacheKey, response);
  return response;
}

export async function getManagerLeaguesGWSummary(
  managerId: number,
  forceRefresh: boolean = false
): Promise<Record<number, LeagueGWSummary>> {
  const cacheKey = `fpl_leagues_gw_summary_${managerId}`;
  if (!forceRefresh) {
    const cached = getCached<Record<number, LeagueGWSummary>>(cacheKey);
    if (cached) return cached;
  }

  // 1. Get Manager Profile to know classic leagues
  const profile = await getManagerProfile(managerId);
  const classicLeagues = profile.leagues?.classic || [];

  // 2. Get current GW
  let currentGw = 1;
  try {
    const bootstrap = await getBootstrapStatic();
    const cur = bootstrap.events.find((e) => e.is_current) || bootstrap.events.find((e) => e.is_next);
    if (cur) currentGw = cur.id;
  } catch (e) {
    console.warn("Bootstrap fetch warning:", e);
  }

  // Sort leagues to prioritize private mini-leagues (type !== 's' and smaller member count) first
  const sortedLeagues = [...classicLeagues].sort((a, b) => {
    const countA = a.rank_count || 999999;
    const countB = b.rank_count || 999999;
    if (a.league_type === "s" && b.league_type !== "s") return 1;
    if (a.league_type !== "s" && b.league_type === "s") return -1;
    return countA - countB;
  });

  const summaries: Record<number, LeagueGWSummary> = {};
  const userGwPoints = profile.summary_event_points || 0;
  const userTotalPoints = profile.summary_overall_points || 0;

  // Process all leagues with safe concurrency (3 workers) to prevent 429 rate limiting
  await pMap(sortedLeagues, 3, async (league) => {
    try {
      const rankCount = league.rank_count || 50;

      // Smart page limit:
      // - Mini-leagues under 160 members: fetch all pages (1-3 pages) for 100% exact ranking
      // - Mid-size leagues (160 - 400 members): fetch up to 4 pages
      // - Large sponsor/country leagues (> 400 members): fetch 1-2 pages so we don't exhaust rate limits
      let maxPages = 1;
      if (rankCount <= 160) {
        maxPages = Math.ceil(rankCount / 50);
      } else if (rankCount <= 400) {
        maxPages = 4;
      } else {
        maxPages = 2;
      }

      const leagueData = await getLeagueDetails(league.id, maxPages, forceRefresh);
      const results = leagueData.standings.results || [];
      if (results.length === 0) return;

      // Check if user is in the fetched results
      const userEntry = results.find((r) => r.entry === managerId);
      const userEventPoints = userEntry ? userEntry.event_total : userGwPoints;
      const userTotal = userEntry ? userEntry.total : userTotalPoints;
      const userOverall = league.entry_rank ?? userEntry?.rank ?? league.rank ?? 0;

      // Sort by event_total desc to find GW rank
      const sortedByGW = [...results].sort((a, b) => b.event_total - a.event_total);

      let gwRank = 1;
      let isApproximate = false;

      if (userEntry) {
        // Exact rank found in results
        for (let i = 0; i < sortedByGW.length; i++) {
          if (i > 0 && sortedByGW[i].event_total < sortedByGW[i - 1].event_total) {
            gwRank = i + 1;
          }
          if (sortedByGW[i].entry === managerId) {
            break;
          }
        }
      } else {
        // User not in fetched top pages (e.g. large league > 100 managers)
        // Check if user's score placed among top fetched entries
        const minFetchedScore = sortedByGW[sortedByGW.length - 1]?.event_total ?? 0;
        if (userEventPoints <= minFetchedScore) {
          gwRank = results.length;
          isApproximate = true;
        } else {
          // User placed inside the top list
          for (let i = 0; i < sortedByGW.length; i++) {
            if (sortedByGW[i].event_total > userEventPoints) {
              gwRank = i + 2;
            } else {
              break;
            }
          }
          isApproximate = false;
        }
      }

      const totalManagers = rankCount || results.length;
      const gwHigh = Math.max(...results.map((r) => r.event_total));
      const gwSum = results.reduce((acc, curr) => acc + curr.event_total, 0);
      const gwAvg = Math.round(gwSum / results.length);

      summaries[league.id] = {
        league_id: league.id,
        league_name: league.name,
        total_managers: totalManagers,
        gw: currentGw,
        manager_gw_rank: gwRank,
        manager_gw_points: userEventPoints,
        league_gw_high: gwHigh,
        league_gw_avg: gwAvg,
        manager_overall_rank: userOverall,
        manager_total_points: userTotal,
        is_approximate: isApproximate,
      };
    } catch (err) {
      console.warn(`Could not compute GW rank for league #${league.id}:`, err);
    }
  });

  setCache(cacheKey, summaries);
  return summaries;
}

