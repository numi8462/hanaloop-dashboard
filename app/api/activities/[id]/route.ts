import { NextRequest, NextResponse } from "next/server";
import { dbDeleteActivity, dbUpdateActivity } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await dbDeleteActivity(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/activities/:id]", error);
    const message =
      error instanceof Error ? error.message : "삭제에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dbUpdateActivity(id, body);
    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PATCH /api/activities/:id]", error);
    const message =
      error instanceof Error ? error.message : "수정에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
