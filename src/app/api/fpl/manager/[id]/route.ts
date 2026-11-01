import { NextRequest, NextResponse } from "next/server";
import { getManagerProfile } from "@/lib/fpl-api";
import { MOCK_MANAGER_PROFILE } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const managerId = parseInt(params.id, 10);
  const { searchParams } = new URL(request.url);
  const useMock = searchParams.get("mock") === "true";

  if (isNaN(managerId) || managerId <= 0) {
    return NextResponse.json(
      { error: "Invalid Manager ID provided. Please provide a positive numeric ID." },
      { status: 400 }
    );
  }

  // Explicit demo/mock mode or fallback
  if (useMock || managerId === 1042318) {
    return NextResponse.json(MOCK_MANAGER_PROFILE);
  }

  try {
    const profile = await getManagerProfile(managerId);
    return NextResponse.json(profile);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch manager data";
    const status = message.includes("not found") ? 404 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}

