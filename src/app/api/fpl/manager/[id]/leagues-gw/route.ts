import { NextRequest, NextResponse } from "next/server";
import { getManagerLeaguesGWSummary } from "@/lib/fpl-api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const managerId = parseInt(params.id, 10);
  const { searchParams } = new URL(request.url);
  const fresh = searchParams.get("fresh") === "true";

  if (isNaN(managerId) || managerId <= 0) {
    return NextResponse.json(
      { error: "Invalid Manager ID provided." },
      { status: 400 }
    );
  }

  try {
    const summaries = await getManagerLeaguesGWSummary(managerId, fresh);
    return NextResponse.json(summaries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch leagues GW ranks";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
