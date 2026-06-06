import { NextRequest, NextResponse } from "next/server";
import { dbDeleteGoal } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbDeleteGoal(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/goals/:id]", error);
    return NextResponse.json(
      { error: "목표 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
