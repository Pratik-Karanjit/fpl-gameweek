async function test() {
  const res = await fetch("https://fantasy.premierleague.com/api/entry/30102/");
  const d = await res.json();
  console.log("Manager:", d.player_first_name, d.player_last_name, "Team:", d.name);
  console.log("Total classic leagues:", d.leagues.classic.length);
  for (const l of d.leagues.classic) {
    console.log(`ID: ${l.id} | Name: ${l.name} | entry_rank: ${l.entry_rank} | rank: ${l.rank} | rank_count: ${l.rank_count} | type: ${l.league_type}`);
  }
}
test().catch(console.error);

