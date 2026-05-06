import {
  ActivityData,
  EmissionFactor,
  PcfResult,
  CategorySummary,
  MonthlySummary,
  DashboardSummary,
  EmissionType,
  SCOPE_MAP,
} from "@/types";

/**
 * CO₂e 계산 핵심 공식
 * CO₂e (kgCO₂e) = 활동량 × 배출계수
 * 예: 전기 110kWh × 0.456 kgCO₂e/kWh = 50.16 kgCO₂e
 */
export function calculateCo2e(amount: number, emissionFactor: number): number {
  return parseFloat((amount * emissionFactor).toFixed(4));
}

export function kgToTon(kg: number): number {
  return parseFloat((kg / 1000).toFixed(4));
}

export function tonToKg(ton: number): number {
  return parseFloat((ton * 1000).toFixed(4));
}

/**
 * 활동 데이터 + 배출계수 → PCF 결과 목록 생성
 *
 * 각 활동 데이터에 맞는 배출계수를 찾아서 CO₂e를 계산함
 * 배출계수가 없는 활동 데이터는 결과에서 제외됨
 */
export function generatePcfResults(
  activities: ActivityData[],
  emissionFactors: EmissionFactor[],
): PcfResult[] {
  const results: PcfResult[] = [];

  for (const activity of activities) {
    const factor = emissionFactors.find(
      (f) =>
        f.type === activity.type &&
        f.description === activity.description &&
        f.isActive,
    );

    // 매칭되는 배출계수가 없으면 해당 활동 데이터는 건너뜀
    if (!factor) continue;

    const co2e = calculateCo2e(activity.amount, factor.emissionFactor);

    results.push({
      id: `pcf_${activity.id}`,
      date: activity.date,
      type: activity.type as EmissionType,
      description: activity.description,
      amount: activity.amount,
      unit: activity.unit,
      emissionFactor: factor.emissionFactor,
      emissionFactorId: factor.id,
      co2e,
      scope: SCOPE_MAP[activity.type as EmissionType],
      calculatedAt: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * PCF 결과 → 카테고리(전기/원소재/운송)별 집계
 * 대시보드 파이 차트에서 사용
 */
export function aggregateByCategory(results: PcfResult[]): CategorySummary[] {
  const totalCo2e = results.reduce((sum, r) => sum + r.co2e, 0);

  // 카테고리별로 CO₂e 합산
  const byType = results.reduce(
    (acc, r) => {
      if (!acc[r.type]) {
        acc[r.type] = { totalCo2e: 0, scope: SCOPE_MAP[r.type], count: 0 };
      }
      acc[r.type].totalCo2e += r.co2e;
      acc[r.type].count += 1;
      return acc;
    },
    {} as Record<string, { totalCo2e: number; scope: string; count: number }>,
  );

  return Object.entries(byType).map(([type, data]) => ({
    type: type as EmissionType,
    totalCo2e: parseFloat(data.totalCo2e.toFixed(4)),
    scope: data.scope as PcfResult["scope"],
    // 전체 대비 해당 카테고리 비율 (%)
    percentage:
      totalCo2e > 0
        ? parseFloat(((data.totalCo2e / totalCo2e) * 100).toFixed(1))
        : 0,
    count: data.count,
  }));
}

/**
 * PCF 결과 → 월별 집계
 * 대시보드 월별 바 차트에서 사용
 */
export function aggregateByMonth(results: PcfResult[]): MonthlySummary[] {
  const byMonth = results.reduce(
    (acc, r) => {
      const yearMonth = r.date.slice(0, 7);
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          yearMonth,
          totalCo2e: 0,
          byType: {} as Record<EmissionType, number>,
        };
      }
      acc[yearMonth].totalCo2e += r.co2e;
      // 카테고리별 월간 합계도 같이 계산 (스택 바 차트용)
      acc[yearMonth].byType[r.type] =
        (acc[yearMonth].byType[r.type] || 0) + r.co2e;
      return acc;
    },
    {} as Record<string, MonthlySummary>,
  );

  // 날짜 오름차순 정렬
  return Object.values(byMonth).sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth),
  );
}

/**
 * 대시보드 전체 요약 데이터 생성
 * 총 CO₂e, 카테고리별 집계, 월별 집계를 한 번에 반환
 */
export function buildDashboardSummary(results: PcfResult[]): DashboardSummary {
  return {
    totalCo2e: parseFloat(
      results.reduce((sum, r) => sum + r.co2e, 0).toFixed(4),
    ),
    byCategory: aggregateByCategory(results),
    byMonth: aggregateByMonth(results),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * CO₂e 값을 읽기 좋은 형태로 포맷
 */
export function formatCo2e(kgCo2e: number): { value: string; unit: string } {
  return {
    value: kgCo2e.toLocaleString("ko-KR", { maximumFractionDigits: 2 }),
    unit: "kgCO₂e",
  };
}
