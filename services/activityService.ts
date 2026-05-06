import { ActivityData, ActivityInput } from "@/types";

/** 활동 데이터 전체 조회 */
export async function getActivities(): Promise<ActivityData[]> {
  const res = await fetch("/api/activities");
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  const json = await res.json();
  return json.data;
}

/** 활동 데이터 생성 */
export async function createActivity(
  input: ActivityInput,
): Promise<ActivityData> {
  const res = await fetch("/api/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "저장에 실패했습니다.");
  return json.data;
}

/** 활동 데이터 삭제 */
export async function deleteActivity(id: string): Promise<void> {
  const res = await fetch(`/api/activities/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("삭제에 실패했습니다.");
}

/** 활동 데이터 수정 */
export async function updateActivity(
  id: string,
  input: Partial<ActivityInput>,
): Promise<ActivityData> {
  const res = await fetch(`/api/activities/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "수정에 실패했습니다.");
  return json.data;
}
