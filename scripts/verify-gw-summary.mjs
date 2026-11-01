import { getManagerLeaguesGWSummary } from '../src/lib/fpl-api.js';

async function run() {
  console.log("Fetching GW ranks for manager 30102...");
  const summaries = await getManagerLeaguesGWSummary(30102, true);
  console.log("Total leagues summarized:", Object.keys(summaries).length);
  
  // Check Fanatics League S11 (802617)
  const fanatics = summaries[802617];
  console.log("Fanatics League (802617):", fanatics);

  // Check 977 Sports (503092)
  console.log("977 Sports (503092):", summaries[503092]);

  // Check Gorkhali's Weekly (873571)
  console.log("Gorkhali's Weekly (873571):", summaries[873571]);
}

run().catch(console.error);

