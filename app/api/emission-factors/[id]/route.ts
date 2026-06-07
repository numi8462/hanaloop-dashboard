import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { emissionFactor } = await request.json();

    if (!emissionFactor || emissionFactor <= 0) {
      return NextResponse.json(
        { error: "0보다 큰 값을 입력해주세요." },
        { status: 400 },
      );
    }

    const existing = await prisma.emissionFactor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "배출계수를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const now = new Date();

    const [, newVersion] = await prisma.$transaction([
      // 기존 버전 비활성화
      prisma.emissionFactor.update({
        where: { id },
        data: { isActive: false, validTo: now },
      }),
      // 새 버전 생성
      prisma.emissionFactor.create({
        data: {
          type: existing.type,
          description: existing.description,
          emissionFactor,
          unit: existing.unit,
          version: existing.version + 1,
          isActive: true,
          validFrom: now,
          validTo: null,
        },
      }),
    ]);

    return NextResponse.json({ data: newVersion });
  } catch (error) {
    console.error("[PATCH /api/emission-factors/:id]", error);
    return NextResponse.json(
      { error: "수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await prisma.emissionFactor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "배출계수를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const now = new Date();

    // 같은 type, description의 현재 활성 버전 비활성화
    await prisma.emissionFactor.updateMany({
      where: {
        type: existing.type,
        description: existing.description,
        isActive: true,
      },
      data: { isActive: false, validTo: now },
    });

    // 선택한 버전 활성화
    const updated = await prisma.emissionFactor.update({
      where: { id },
      data: { isActive: true, validTo: null },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[PUT /api/emission-factors/:id]", error);
    return NextResponse.json(
      { error: "버전 변경에 실패했습니다." },
      { status: 500 },
    );
  }
}
