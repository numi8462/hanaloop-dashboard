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

export function calculateCo2e(amount: number, emissionFactor: number): number {
  return parseFloat((amount * emissionFactor).toFixed(4));
}

export function kgToTon(kg: number): number {
  return parseFloat((kg / 1000).toFixed(4));
}

export function tonToKg(ton: number): number {
  return parseFloat((ton * 1000).toFixed(4));
}

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

export function aggregateByCategory(results: PcfResult[]): CategorySummary[] {
  const totalCo2e = results.reduce((sum, r) => sum + r.co2e, 0);

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
    percentage:
      totalCo2e > 0
        ? parseFloat(((data.totalCo2e / totalCo2e) * 100).toFixed(1))
        : 0,
    count: data.count,
  }));
}

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
      acc[yearMonth].byType[r.type] =
        (acc[yearMonth].byType[r.type] || 0) + r.co2e;
      return acc;
    },
    {} as Record<string, MonthlySummary>,
  );

  return Object.values(byMonth).sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth),
  );
}

export function buildDashboardSummary(results: PcfResult[]): DashboardSummary {
  const totalCo2e = parseFloat(
    results.reduce((sum, r) => sum + r.co2e, 0).toFixed(4),
  );

  return {
    totalCo2e,
    byCategory: aggregateByCategory(results),
    byMonth: aggregateByMonth(results),
    lastUpdated: new Date().toISOString(),
  };
}

export function formatCo2e(kgCo2e: number): { value: string; unit: string } {
  if (kgCo2e >= 1000) {
    return {
      value: kgToTon(kgCo2e).toLocaleString("ko-KR", {
        maximumFractionDigits: 2,
      }),
      unit: "tCO₂e",
    };
  }
  return {
    value: kgCo2e.toLocaleString("ko-KR", { maximumFractionDigits: 2 }),
    unit: "kgCO₂e",
  };
}

export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${year}년 ${parseInt(month)}월`;
}
