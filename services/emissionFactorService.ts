import { EmissionFactor } from "@/types";

/** 전체 배출계수 조회 (버전 이력 포함) */
export async function getEmissionFactors(): Promise<EmissionFactor[]> {
  const res = await fetch("/api/emission-factors");
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  const json = await res.json();
  return json.data;
}

/** 배출계수 수정 (새 버전 생성) */
export async function updateEmissionFactor(
  id: string,
  emissionFactor: number,
): Promise<EmissionFactor> {
  const res = await fetch(`/api/emission-factors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emissionFactor }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "수정에 실패했습니다.");
  return json.data;
}

/** 특정 버전을 활성 버전으로 변경 */
export async function activateEmissionFactor(
  id: string,
): Promise<EmissionFactor> {
  const res = await fetch(`/api/emission-factors/${id}`, {
    method: "PUT",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "버전 변경에 실패했습니다.");
  return json.data;
}
