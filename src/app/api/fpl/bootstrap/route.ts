import { NextResponse } from "next/server";
import { getBootstrapStatic } from "@/lib/fpl-api";

export async function GET() {
  try {
    const bootstrap = await getBootstrapStatic();
    return NextResponse.json(bootstrap);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load FPL bootstrap static data";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

