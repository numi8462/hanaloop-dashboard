import { NextRequest, NextResponse } from "next/server";
import { dbGetGoals, dbUpsertGoal } from "@/lib/db";
import { z } from "zod";

const GoalInputSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  targetCo2e: z.number().positive("0보다 큰 값을 입력해주세요."),
});

export async function GET() {
  try {
    const goals = await dbGetGoals();
    return NextResponse.json({ data: goals });
  } catch (error) {
    console.error("[GET /api/goals]", error);
    return NextResponse.json(
      { error: "목표를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = GoalInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 데이터가 유효하지 않습니다.",
          details: parsed.error.issues,
        },
        { status: 400 },
      );
    }
    const goal = await dbUpsertGoal(parsed.data.year, parsed.data.targetCo2e);
    return NextResponse.json({ data: goal });
  } catch (error) {
    console.error("[POST /api/goals]", error);
    return NextResponse.json(
      { error: "목표 저장에 실패했습니다." },
      { status: 500 },
    );
  }
}
