import { NextResponse } from "next/server";
import { dbGetActivities, dbGetActiveEmissionFactors } from "@/lib/db";
import {
  generatePcfResults,
  buildDashboardSummary,
} from "@/lib/pcf-calculator";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  try {
    const [activities, factors] = await Promise.all([
      dbGetActivities(),
      dbGetActiveEmissionFactors(),
    ]);

    const results = generatePcfResults(activities, factors);

    if (format === "summary") {
      const summary = buildDashboardSummary(results);
      return NextResponse.json({ data: summary });
    }

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("[GET /api/pcf]", error);
    return NextResponse.json(
      { error: "PCF 데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}
