"use client";

import CategoryChart from "@/components/dashboard/CategoryChart";
import MonthlyTrendChart from "@/components/dashboard/MontlyTrendChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import {
  useDashboard,
  useCategorySummary,
  useMonthlySummary,
  useTotalCo2e,
} from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { isLoading, error } = useDashboard();
  const totalCo2e = useTotalCo2e();
  const byCategory = useCategorySummary();
  const byMonth = useMonthlySummary();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          대시보드
        </h1>
        <p className="text-sm mt-1 text-slate-400">탄소 발자국</p>
      </div>

      {/* 에러 */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm bg-red-500/10 border border-red-500/30 text-red-400">
          <span>데이터를 불러오는 중 오류가 발생했습니다: {error}</span>
        </div>
      )}

      {/* KPI 카드 */}
      <SummaryCards
        totalCo2e={totalCo2e}
        byCategory={byCategory}
        isLoading={isLoading}
      />

      {/* 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
        <div className="lg:col-span-1">
          <CategoryChart byCategory={byCategory} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-3">
          <MonthlyTrendChart byMonth={byMonth} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
