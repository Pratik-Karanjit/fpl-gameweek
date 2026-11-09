import { NextRequest, NextResponse } from "next/server";
import { getAggregatedLeague } from "@/lib/fpl-api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const leagueId = parseInt(params.id, 10);
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("fresh") === "true";

  if (isNaN(leagueId) || leagueId <= 0) {
    return NextResponse.json(
      { error: "Invalid League ID provided. Must be a valid numeric ID." },
      { status: 400 }
    );
  }

  try {
    const data = await getAggregatedLeague(leagueId, fresh);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch and aggregate league data";
    const status = message.includes("not found") ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
