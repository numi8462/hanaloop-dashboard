import { dbCreateActivity, dbGetActivities } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ActivityInputSchema = z.object({
  date: z.string().min(1, "날짜를 입력해주세요."),
  type: z.enum(["전기", "원소재", "운송"], { message: "유형을 선택해주세요." }),
  description: z.string().min(1, "설명을 입력해주세요."),
  amount: z
    .number({ invalid_type_error: "숫자를 입력해주세요." })
    .positive("0보다 큰 값을 입력해주세요."),
  unit: z.string().min(1, "단위를 입력해주세요."),
});

export async function GET() {
  try {
    const activities = await dbGetActivities();
    return NextResponse.json({ data: activities });
  } catch (error) {
    console.error("[GET /api/activities]", error);
    return NextResponse.json(
      { error: "활동 데이터를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ActivityInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 데이터가 유효하지 않습니다.",
          details: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const created = await dbCreateActivity(parsed.data);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/activities]", error);
    const message =
      error instanceof Error ? error.message : "저장에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
