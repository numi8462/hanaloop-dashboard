import { EmissionFactor } from "@/types";

/** 전체 배출계수 조회 (버전 이력 포함) */
export async function getEmissionFactors(): Promise<EmissionFactor[]> {
  const res = await fetch("/api/emission-factors");
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  const json = await res.json();
  return json.data;
}
