const COMMON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  Accept: "application/json",
};

async function testFanatics() {
  const leagueId = 802617;
  const managerId = 30102;
  
  // Page 1
  const r1 = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=1`, { headers: COMMON_HEADERS });
  const d1 = await r1.json();
  
  // Page 2
  const r2 = await fetch(`https://fantasy.premierleague.com/api/leagues-classic/${leagueId}/standings/?page_standings=2`, { headers: COMMON_HEADERS });
  const d2 = await r2.json();

  const all = [...d1.standings.results, ...d2.standings.results];
  console.log(`Total managers in Fanatics: ${all.length}`);

  const user = all.find(r => r.entry === managerId);
  console.log("User entry:", user);

  const sortedByGW = [...all].sort((a, b) => b.event_total - a.event_total);
  let rank = 1;
  for (let i = 0; i < sortedByGW.length; i++) {
    if (i > 0 && sortedByGW[i].event_total < sortedByGW[i - 1].event_total) {
      rank = i + 1;
    }
    if (sortedByGW[i].entry === managerId) {
      break;
    }
  }

  console.log(`Calculated GW Rank in Fanatics: #${rank} of ${all.length} (Points: ${user.event_total})`);
  console.log(`GW High: ${sortedByGW[0].event_total} (${sortedByGW[0].player_name})`);
}

testFanatics().catch(console.error);

