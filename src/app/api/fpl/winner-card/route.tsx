import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// In-memory cache for screenshot URLs so each manager's GW pitch is only fetched once
const screenshotCache = new Map<string, string>();

async function getRealFplPitchScreenshot(entryId: number, gw: number): Promise<string | null> {
  const cacheKey = `${entryId}_${gw}`;
  if (screenshotCache.has(cacheKey)) {
    return screenshotCache.get(cacheKey)!;
  }

  try {
    const targetUrl = `https://fantasy.premierleague.com/entry/${entryId}/event/${gw}`;
    const microlinkUrl =
      `https://api.microlink.io?` +
      new URLSearchParams({
        url: targetUrl,
        screenshot: "true",
        element: ".x8kmww0",
        "scripts.hide":
          "#onetrust-consent-sdk, #onetrust-banner-sdk, .onetrust-pc-dark-filter, [id*='onetrust']",
        waitForSelector: ".x8kmww0",
        waitForTimeout: "2500",
        meta: "false",
      });

    const res = await fetch(microlinkUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      // 20 second timeout for external browser screenshot capture
      signal: AbortSignal.timeout(20000),
    });

    if (res.ok) {
      const data = await res.json();
      const screenshotUrl = data?.data?.screenshot?.url;
      if (screenshotUrl) {
        screenshotCache.set(cacheKey, screenshotUrl);
        return screenshotUrl;
      }
    }
  } catch (err) {
    console.warn(`Could not capture real FPL pitch screenshot for entry #${entryId} GW #${gw}:`, err);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const entryId = parseInt(searchParams.get("entryId") || "0", 10);
  const gw = searchParams.get("gw") || "1";
  const playerName = searchParams.get("playerName") || "FPL Manager";
  const teamName = searchParams.get("teamName") || "FPL Team";
  const points = searchParams.get("points") || "0";
  const leagueName = searchParams.get("leagueName") || "FPL Mini-League";
  const prizeMoney = searchParams.get("prizeMoney") || "Winner";

  let pitchScreenshotUrl: string | null = null;
  if (entryId > 0) {
    pitchScreenshotUrl = await getRealFplPitchScreenshot(entryId, parseInt(gw, 10));
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#18001d",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top 6px PL Neon Green Accent Line */}
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "#00FF87",
            display: "flex",
          }}
        />

        {/* 1. Official Premier League Style Header Banner */}
        <div
          style={{
            width: "100%",
            height: "165px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 36px",
            background: "linear-gradient(135deg, #37003C 0%, #28002B 50%, #1c001f 100%)",
            borderBottom: "2px solid #4a0052",
          }}
        >
          {/* Left: League & Team Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              maxWidth: "540px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "16px" }}>🏆</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  color: "#00FF87",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                {leagueName.toUpperCase()} • GAMEWEEK {gw} WINNER
              </span>
            </div>

            <span
              style={{
                fontSize: "30px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {teamName}
            </span>

            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#D8C5DF",
                marginTop: "4px",
              }}
            >
              Managed by {playerName}
            </span>
          </div>

          {/* Right: Points Badge & Prize Badge */}
          <div
            style={{
              display: "flex",
              gap: "14px",
            }}
          >
            {/* GW Points Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(36, 0, 39, 0.95)",
                border: "2px solid #00FF87",
                borderRadius: "14px",
                padding: "8px 20px",
                minWidth: "120px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#A28DA6",
                  letterSpacing: "1px",
                }}
              >
                GW POINTS
              </span>
              <span
                style={{
                  fontSize: "38px",
                  fontWeight: 900,
                  color: "#00FF87",
                  lineHeight: 1.1,
                }}
              >
                {points}
              </span>
            </div>

            {/* Prize Won Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(36, 0, 39, 0.95)",
                border: "2px solid #F59E0B",
                borderRadius: "14px",
                padding: "8px 20px",
                minWidth: "130px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#FCD34D",
                  letterSpacing: "1px",
                }}
              >
                PRIZE WON
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#FBBF24",
                  lineHeight: 1.3,
                  textAlign: "center",
                  maxWidth: "135px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {prizeMoney}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Original Real FPL Website Pitch Screenshot */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#18001d",
            padding: "10px 16px",
            overflow: "hidden",
          }}
        >
          {pitchScreenshotUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pitchScreenshotUrl}
              alt="Official FPL Pitch Screenshot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                color: "#D8C5DF",
              }}
            >
              <span style={{ fontSize: "28px", marginBottom: "12px" }}>⚽</span>
              <span style={{ fontSize: "18px", fontWeight: 700 }}>
                Official Fantasy Premier League Squad
              </span>
              <span style={{ fontSize: "13px", color: "#A28DA6", marginTop: "4px" }}>
                Entry #{entryId} • Gameweek {gw}
              </span>
            </div>
          )}
        </div>

        {/* 3. Footer Watermark */}
        <div
          style={{
            width: "100%",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#120016",
            borderTop: "1px solid #28002B",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#A28DA6",
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            Official Fantasy Premier League • Captured live from fantasy.premierleague.com
          </span>
        </div>
      </div>
    ),
    {
      width: 900,
      height: 1240,
    }
  );
}
