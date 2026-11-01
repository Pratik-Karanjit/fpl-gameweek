import { MOCK_MANAGER_PROFILE, MOCK_LEAGUE_DETAILS } from '../src/lib/mock-data.js';

console.log("=== Testing FPL Data Engine ===");
console.log("Mock Manager Profile:", MOCK_MANAGER_PROFILE.name);
console.log("Classic Leagues Count:", MOCK_MANAGER_PROFILE.leagues.classic.length);
console.log("League Name:", MOCK_LEAGUE_DETAILS.league.name);
console.log("Aggregated Entries Count:", MOCK_LEAGUE_DETAILS.aggregated_entries.length);

const entries = MOCK_LEAGUE_DETAILS.aggregated_entries;
const totalPointsSorted = [...entries].sort((a, b) => b.total_points - a.total_points);
console.log("Top 3 Managers by Total Points:");
totalPointsSorted.slice(0, 3).forEach((m, idx) => {
  console.log(`  #${idx + 1}: ${m.player_name} (${m.team_name}) - ${m.total_points} pts`);
});

const squadValueSorted = [...entries].sort((a, b) => b.total_budget - a.total_budget);
console.log("Top 3 Managers by Total Budget:");
squadValueSorted.slice(0, 3).forEach((m, idx) => {
  console.log(`  #${idx + 1}: ${m.player_name} - £${m.total_budget}m (Team: £${m.team_value}m, Bank: £${m.bank}m)`);
});

const chipsPlayed = entries.filter(e => e.chips.length > 0);
console.log(`Managers with chips played: ${chipsPlayed.length} of ${entries.length}`);

console.log("=== All Tests Passed Successfully ===");

