import { PcfResult, DashboardSummary } from "@/types";

/** PCF 계산 결과 조회 */
export async function getPcfResults(): Promise<PcfResult[]> {
  const res = await fetch("/api/pcf");
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  const json = await res.json();
  return json.data;
}

/** 대시보드 요약 데이터 조회 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch("/api/pcf?format=summary");
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  const json = await res.json();
  return json.data;
}
