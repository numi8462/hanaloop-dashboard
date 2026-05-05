import { NextRequest, NextResponse } from "next/server";
import { dbUpdateEmissionFactor } from "@/lib/db";
import { z } from "zod";

const EmissionFactorUpdateSchema = z.object({
  emissionFactor: z
    .number({ error: "숫자를 입력해주세요." })
    .positive("0보다 큰 값을 입력해주세요."),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const parsed = EmissionFactorUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "입력 데이터가 유효하지 않습니다.",
          details: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const updated = await dbUpdateEmissionFactor(
      params.id,
      parsed.data.emissionFactor,
    );
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/emission-factors/:id]", error);
    const message =
      error instanceof Error ? error.message : "수정에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
