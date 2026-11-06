import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Locate available browser binary on Windows/Linux/Mac
function findBrowserExecutable(): string | null {
  const candidates = [
    // Standard Windows Chrome & Edge
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    // User AppData Chrome & Edge
    process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, "Google\\Chrome\\Application\\chrome.exe")
      : "",
    process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, "Microsoft\\Edge\\Application\\msedge.exe")
      : "",
    // Linux / Mac paths
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

// Escape XML for SVG text nodes
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      entryId,
      gw,
      playerName = "FPL Manager",
      teamName = "FPL Team",
      points = 0,
      leagueName = "FPL Mini-League",
      prizeMoney = "",
    } = body;

    if (!entryId || !gw) {
      return NextResponse.json(
        { error: "Manager entryId and gameweek number are required." },
        { status: 400 }
      );
    }

    const browserExe = findBrowserExecutable();
    if (!browserExe) {
      return NextResponse.json(
        {
          error:
            "Could not locate a Chrome or Edge browser executable on the server to take the screenshot.",
        },
        { status: 500 }
      );
    }

    // 1. Launch Playwright headless browser
    const browser = await chromium.launch({
      executablePath: browserExe,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 1000 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    let pitchBuffer: Buffer | null = null;

    try {
      const url = `https://fantasy.premierleague.com/entry/${entryId}/event/${gw}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });

      // Dismiss cookie consent if shown
      try {
        const cookieBtn = await page.$("#onetrust-accept-btn-handler");
        if (cookieBtn) await cookieBtn.click();
      } catch {
        // Ignore cookie banner errors
      }

      // Wait for pitch or substitute section to render
      await page.waitForFunction(
        () => {
          return (
            document.querySelector(".x8kmww0") ||
            document.querySelector('[class*="pitch" i]') ||
            Array.from(document.querySelectorAll("div")).some(
              (d) =>
                d.innerText &&
                d.innerText.includes("Substitutes") &&
                d.innerText.includes("points")
            )
          );
        },
        { timeout: 15000 }
      );

      // Locate pitch element and tag it
      const foundTarget = await page.evaluate(() => {
        const el =
          document.querySelector(".x8kmww0") ||
          document.querySelector('[class*="pitch" i]') ||
          Array.from(document.querySelectorAll("div")).find(
            (d) =>
              d.innerText &&
              d.innerText.includes("Substitutes") &&
              d.innerText.includes("points")
          );

        if (el) {
          el.setAttribute("data-fpl-pitch-card", "true");
          // Hide any sticky overlay or scrollbar
          return true;
        }
        return false;
      });

      if (!foundTarget) {
        throw new Error("Could not find the squad pitch on the FPL page.");
      }

      // Screenshot the pitch element directly
      const targetLocator = page.locator('[data-fpl-pitch-card="true"]');
      pitchBuffer = await targetLocator.screenshot({
        type: "png",
        scale: "css",
      });
    } finally {
      await browser.close();
    }

    if (!pitchBuffer) {
      throw new Error("Failed to capture pitch screenshot.");
    }

    // 2. Measure pitch screenshot dimensions with Sharp
    const pitchMeta = await sharp(pitchBuffer).metadata();
    const cardWidth = pitchMeta.width || 900;
    const pitchHeight = pitchMeta.height || 890;
    const headerHeight = 160;
    const footerHeight = 45;
    const totalHeight = headerHeight + pitchHeight + footerHeight;

    const safeLeagueName = escapeXml(String(leagueName).toUpperCase());
    const safeTeamName = escapeXml(String(teamName));
    const safePlayerName = escapeXml(String(playerName));
    const safePrize = escapeXml(String(prizeMoney || "Honorary Winner"));

    // 3. Create SVG header banner with Premier League design
    const headerSvg = Buffer.from(`
      <svg width="${cardWidth}" height="${headerHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#37003C"/>
            <stop offset="60%" stop-color="#28002B"/>
            <stop offset="100%" stop-color="#1F0022"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#headerGrad)"/>
        <rect x="0" y="0" width="100%" height="5" fill="#00FF87"/>
        
        <!-- League & GW Badge -->
        <text x="35" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="bold" fill="#00FF87" letter-spacing="1">
          ${safeLeagueName} • GAMEWEEK ${gw} WINNER
        </text>

        <!-- Team Name & Manager -->
        <text x="35" y="78" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF">
          ${safeTeamName}
        </text>
        <text x="35" y="106" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#D8C5DF">
          Managed by ${safePlayerName}
        </text>

        <!-- GW Points Badge -->
        <rect x="${cardWidth - 290}" y="28" width="125" height="78" rx="14" fill="#240027" stroke="#6F2E77" stroke-width="1.5"/>
        <text x="${cardWidth - 227}" y="52" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="bold" fill="#A28DA6" text-anchor="middle">GW POINTS</text>
        <text x="${cardWidth - 227}" y="90" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="34" font-weight="900" fill="#00FF87" text-anchor="middle">${points}</text>

        <!-- Prize Money Badge -->
        <rect x="${cardWidth - 150}" y="28" width="130" height="78" rx="14" fill="#240027" stroke="#F59E0B" stroke-width="1.5"/>
        <text x="${cardWidth - 85}" y="52" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="bold" fill="#FCD34D" text-anchor="middle">PRIZE WON</text>
        <text x="${cardWidth - 85}" y="86" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="900" fill="#FBBF24" text-anchor="middle">${safePrize}</text>
      </svg>
    `);

    // 4. Create SVG footer watermark
    const footerSvg = Buffer.from(`
      <svg width="${cardWidth}" height="${footerHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1F0022"/>
        <line x1="0" y1="0" x2="${cardWidth}" y2="0" stroke="#37003C" stroke-width="1"/>
        <text x="${cardWidth / 2}" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#A28DA6" text-anchor="middle">
          Official Fantasy Premier League • Generated by FPL League Pulse
        </text>
      </svg>
    `);

    // 5. Composite and optimize to lightweight WebP
    const publicDir = path.join(process.cwd(), "public", "winner-cards");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filename = `winner-gw${gw}-${entryId}-${Date.now()}.webp`;
    const outputPath = path.join(publicDir, filename);

    await sharp({
      create: {
        width: cardWidth,
        height: totalHeight,
        channels: 4,
        background: { r: 31, g: 0, b: 34, alpha: 1 },
      },
    })
      .composite([
        { input: headerSvg, top: 0, left: 0 },
        { input: pitchBuffer, top: headerHeight, left: 0 },
        { input: footerSvg, top: headerHeight + pitchHeight, left: 0 },
      ])
      .webp({ quality: 85 })
      .toFile(outputPath);

    const fileStats = fs.statSync(outputPath);
    const fileSizeKb = Number((fileStats.size / 1024).toFixed(1));

    return NextResponse.json({
      success: true,
      filename,
      imageUrl: `/winner-cards/${filename}`,
      fileSizeKb,
      manager: {
        playerName,
        teamName,
        gw,
        points,
        prizeMoney,
      },
    });
  } catch (err: unknown) {
    console.error("Error generating winner card:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

