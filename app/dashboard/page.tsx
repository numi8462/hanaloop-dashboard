"use client";

import CategoryChart from "@/components/dashboard/CategoryChart";
import MonthlyTrendChart from "@/components/dashboard/MontlyTrendChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { useCategorySummary, useMonthlySummary, useTotalCo2e } from "@/hooks";
import { useDashboardStore } from "@/store/dashboardStore";
import { CategorySummary, MonthlySummary } from "@/types";
import { useEffect } from "react";

const DUMMY_CATEGORY: CategorySummary[] = [
  {
    type: "전기",
    totalCo2e: 1200,
    scope: "스코프 2",
    percentage: 23,
    count: 9,
  },
  {
    type: "원소재",
    totalCo2e: 3200,
    scope: "스코프 3",
    percentage: 61,
    count: 11,
  },
  { type: "운송", totalCo2e: 830, scope: "스코프 3", percentage: 16, count: 9 },
];

const DUMMY_MONTHLY: MonthlySummary[] = [
  {
    yearMonth: "2025-01",
    totalCo2e: 800,
    byType: { 전기: 200, 원소재: 450, 운송: 150 },
  },
  {
    yearMonth: "2025-02",
    totalCo2e: 950,
    byType: { 전기: 220, 원소재: 580, 운송: 150 },
  },
  {
    yearMonth: "2025-03",
    totalCo2e: 1100,
    byType: { 전기: 250, 원소재: 700, 운송: 150 },
  },
  {
    yearMonth: "2025-04",
    totalCo2e: 900,
    byType: { 전기: 210, 원소재: 540, 운송: 150 },
  },
  {
    yearMonth: "2025-05",
    totalCo2e: 1050,
    byType: { 전기: 230, 원소재: 670, 운송: 150 },
  },
  {
    yearMonth: "2025-06",
    totalCo2e: 850,
    byType: { 전기: 200, 원소재: 500, 운송: 150 },
  },
  {
    yearMonth: "2025-07",
    totalCo2e: 780,
    byType: { 전기: 180, 원소재: 460, 운송: 140 },
  },
  {
    yearMonth: "2025-08",
    totalCo2e: 820,
    byType: { 전기: 190, 원소재: 490, 운송: 140 },
  },
];

export default function DashboardPage() {
  const { isLoading, error, fetchData } = useDashboardStore();
  const totalCo2e = useTotalCo2e();
  const byCategory = useCategorySummary();
  const byMonth = useMonthlySummary();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          대시보드
        </h1>
        <p className="text-sm mt-1 text-slate-400">탄소 발자국</p>
      </div>

      {/* 에러 */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm bg-red-50 border border-red-200 text-red-600">
          데이터를 불러오는 중 오류가 발생했습니다: {error}
        </div>
      )}

      {/* 테스트용 더미 데이터 */}
      <SummaryCards
        totalCo2e={totalCo2e}
        byCategory={byCategory}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="col-span-1">
          <CategoryChart byCategory={byCategory} isLoading={false} />
        </div>
        <div className="col-span-3">
          <MonthlyTrendChart byMonth={byMonth} isLoading={false} />
        </div>
      </div>
    </div>
  );
}
