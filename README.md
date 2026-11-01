# FPL Mini-League Pulse & Dynamic Ranking Engine

A full-stack sports analytics web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. It connects to the public Fantasy Premier League (FPL) API to pull, aggregate, filter, and dynamically re-rank managers within mini-leagues.

![FPL League Pulse](https://fantasy.premierleague.com/static/libs/premierleague/premierleague.svg)

---

## Features

### 1. Manager & League Input UI
- **Manager ID Search**: Input any public FPL Manager ID to instantly fetch their profile, team name, overall rank, and list of joined classic mini-leagues.
- **Built-in Sample / Demo Manager**: Instant 1-click preview using Alexander Wright (`#1042318`) with 10 realistic mini-league managers, gameweek histories, and chip activations.
- **Guided ID Lookup Tooltip**: Step-by-step instructions showing managers how to find their ID from the FPL website URL.

### 2. Backend Proxy & Data Scraping Engine
- **CORS Bypass & Rate-Limiting Protection**: Next.js server route handlers proxy official FPL endpoints (`/api/entry/{id}/`, `/api/leagues-classic/{id}/standings/`, `/api/entry/{id}/history/`, `/api/bootstrap-static/`).
- **Parallel Granular Aggregation**: Concurrently fetches gameweek points, transfer hits, bench points, team valuations, bank balance, and chip usage for all mini-league rivals with controlled concurrency and in-memory TTL caching.

### 3. Advanced Filtering & Dynamic Ranking
- **Real-Time Dynamic Re-Ranking (1 to $N$)**:
  - Dynamically recalculates rank positions (#1 through #N) whenever filters or sorting criteria change.
  - Compares the dynamic rank against the official league rank with visual delta indicators (`+X`, `-Y`).
- **Multi-Metric Sorting**:
  - Total Points
  - Selected Gameweek Points (GW1, GW2, ... GW10+)
  - Net Gameweek Points (accounting for transfer hits)
  - Squad Value (£m) & Bank Balance (£m)
  - Bench Points
- **Chip Usage Filters**:
  - Filter managers who played **Wildcard (WC)**, **Free Hit (FH)**, **Bench Boost (BB)**, **Triple Captain (3xTC)**, or **No Chips**.
- **Real-Time Search**:
  - Instant client-side search by Manager real name or Team name.
- **Manager Drill-Down Modal**:
  - Click any manager in the table to inspect their complete gameweek progression, transfer costs, bench points, and chip milestones.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/fpl/
│   │   │   ├── bootstrap/route.ts   # Proxies FPL bootstrap metadata
│   │   │   ├── manager/[id]/route.ts # Fetches manager profile & leagues
│   │   │   └── league/[id]/route.ts  # Aggregates standings + rival histories
│   │   ├── globals.css              # Custom styling, dark Premier League theme
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Main dashboard view
│   ├── components/
│   │   ├── Navbar.tsx               # Header, GW indicator, demo toggle
│   │   ├── ManagerInput.tsx         # ID search bar with help guide
│   │   ├── ManagerProfileCard.tsx   # Manager overview card
│   │   ├── LeagueSelector.tsx       # Mini-league grid cards
│   │   ├── LeagueSummaryCards.tsx   # Top score, avg points, squad value
│   │   ├── TableControls.tsx        # Search, chip filters, GW dropdown
│   │   ├── DynamicRankingTable.tsx  # Dynamic 1..N re-ranking table
│   │   └── ManagerDetailModal.tsx   # Granular GW-by-GW breakdown modal
│   ├── lib/
│   │   ├── fpl-api.ts               # Server fetcher, caching, concurrency
│   │   ├── mock-data.ts             # Realistic offline / demo dataset
│   │   └── utils.ts                 # Currency and chip formatting
│   └── types/
│       └── fpl.ts                   # Comprehensive TypeScript definitions
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

