import { NextResponse } from "next/server";
import { dbGetAllEmissionFactors, dbGetActiveEmissionFactors } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";

  try {
    const factors = activeOnly
      ? await dbGetActiveEmissionFactors()
      : await dbGetAllEmissionFactors();
    return NextResponse.json({ data: factors });
  } catch (error) {
    console.error("[GET /api/emission-factors]", error);
    return NextResponse.json(
      { error: "배출계수를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
