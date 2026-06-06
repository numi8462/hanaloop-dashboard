/**
 * 목표 관리 API 호출 함수 모음
 */

import { GoalData } from "@/lib/db/goals";

/** 전체 목표 조회 */
export async function getGoals(): Promise<GoalData[]> {
  const res = await fetch("/api/goals");
  if (!res.ok) throw new Error("목표를 불러오지 못했습니다.");
  const json = await res.json();
  return json.data;
}

/** 목표 생성 또는 수정 */
export async function upsertGoal(
  year: number,
  targetCo2e: number,
): Promise<GoalData> {
  const res = await fetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year, targetCo2e }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "저장에 실패했습니다.");
  return json.data;
}

/** 목표 삭제 */
export async function deleteGoal(id: string): Promise<void> {
  const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("삭제에 실패했습니다.");
}
