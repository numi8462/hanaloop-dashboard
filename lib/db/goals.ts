import { prisma } from "@/lib/prisma";

export interface GoalData {
  id: string;
  year: number;
  targetCo2e: number;
  createdAt: string;
  updatedAt: string;
}

function toGoalData(row: {
  id: string;
  year: number;
  targetCo2e: number;
  createdAt: Date;
  updatedAt: Date;
}): GoalData {
  return {
    id: row.id,
    year: row.year,
    targetCo2e: row.targetCo2e,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** 전체 목표 조회 */
export async function dbGetGoals(): Promise<GoalData[]> {
  const rows = await prisma.goal.findMany({
    orderBy: { year: "desc" },
  });
  return rows.map(toGoalData);
}

/** 특정 연도 목표 조회 */
export async function dbGetGoalByYear(year: number): Promise<GoalData | null> {
  const row = await prisma.goal.findUnique({ where: { year } });
  return row ? toGoalData(row) : null;
}

/** 목표 생성 또는 수정 (upsert) */
export async function dbUpsertGoal(
  year: number,
  targetCo2e: number,
): Promise<GoalData> {
  const row = await prisma.goal.upsert({
    where: { year },
    update: { targetCo2e },
    create: { year, targetCo2e },
  });
  return toGoalData(row);
}

/** 목표 삭제 */
export async function dbDeleteGoal(id: string): Promise<void> {
  await prisma.goal.delete({ where: { id } });
}
