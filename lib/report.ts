import * as XLSX from "xlsx";
import { CategorySummary, MonthlySummary } from "@/types";
import { GoalData } from "@/lib/db/goals";

interface ReportData {
  totalCo2e: number;
  byCategory: CategorySummary[];
  byMonth: MonthlySummary[];
  goals: GoalData[];
  pricePerTon?: number;
}

export function generateExcelReport(data: ReportData): void {
  const { totalCo2e, byCategory, byMonth, goals, pricePerTon = 16000 } = data;
  const wb = XLSX.utils.book_new();

  // ─── 시트 1: 요약 ──────────────────────────────────────────────────────────
  const totalCost = (totalCo2e / 1000) * pricePerTon;
  const summaryData = [
    ["HanaLoop PCF 보고서"],
    ["생성일", new Date().toLocaleDateString("ko-KR")],
    [],
    ["항목", "값", "단위"],
    ["총 배출량", totalCo2e.toFixed(2), "kgCO₂e"],
    ["탄소 비용 (K-ETS 기준)", totalCost.toFixed(0), "원"],
    ["적용 단가", pricePerTon, "원/tCO₂e"],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "요약");

  // ─── 시트 2: 카테고리별 배출량 ─────────────────────────────────────────────
  const categoryData = [
    ["카테고리", "배출량 (kgCO₂e)", "비율 (%)", "GHG Scope"],
    ...byCategory.map((c) => [
      c.type,
      c.totalCo2e.toFixed(2),
      c.percentage.toFixed(1),
      c.scope,
    ]),
    [],
    ["합계", totalCo2e.toFixed(2), "100", ""],
  ];
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
  categorySheet["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, categorySheet, "카테고리별 배출량");

  // ─── 시트 3: 월별 배출량 ───────────────────────────────────────────────────
  const sortedMonths = [...byMonth].sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth),
  );
  const monthlyData = [
    [
      "연월",
      "전기 (kgCO₂e)",
      "원소재 (kgCO₂e)",
      "운송 (kgCO₂e)",
      "합계 (kgCO₂e)",
    ],
    ...sortedMonths.map((m) => {
      const total = Object.values(m.byType).reduce((s, v) => s + v, 0);
      return [
        m.yearMonth,
        (m.byType["전기"] ?? 0).toFixed(2),
        (m.byType["원소재"] ?? 0).toFixed(2),
        (m.byType["운송"] ?? 0).toFixed(2),
        total.toFixed(2),
      ];
    }),
  ];
  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);
  monthlySheet["!cols"] = [
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, monthlySheet, "월별 배출량");

  // ─── 시트 4: 목표 관리 ─────────────────────────────────────────────────────
  if (goals.length > 0) {
    const goalData = [
      [
        "연도",
        "목표 배출량 (kgCO₂e)",
        "현재 배출량 (kgCO₂e)",
        "달성률 (%)",
        "상태",
      ],
      ...goals.map((g) => {
        const currentCo2e = sortedMonths
          .filter((m) => m.yearMonth.startsWith(String(g.year)))
          .reduce(
            (sum, m) =>
              sum + Object.values(m.byType).reduce((s, v) => s + v, 0),
            0,
          );
        const pct = ((currentCo2e / g.targetCo2e) * 100).toFixed(1);
        const status =
          currentCo2e > g.targetCo2e ? "목표 초과" : "목표 달성 중";
        return [
          g.year,
          g.targetCo2e.toFixed(2),
          currentCo2e.toFixed(2),
          pct,
          status,
        ];
      }),
    ];
    const goalSheet = XLSX.utils.aoa_to_sheet(goalData);
    goalSheet["!cols"] = [
      { wch: 10 },
      { wch: 22 },
      { wch: 22 },
      { wch: 14 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(wb, goalSheet, "목표 관리");
  }

  // ─── 파일 다운로드 ─────────────────────────────────────────────────────────
  const fileName = `PCF_보고서_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
