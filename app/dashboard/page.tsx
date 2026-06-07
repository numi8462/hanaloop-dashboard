"use client";

import CarbonCostCard from "@/components/dashboard/CarbonCostCard";
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
        <h1 className="text-2xl font-semibold text-[#0d253d]" style={{ letterSpacing: "-0.64px" }}>
          대시보드
        </h1>
        <p className="text-sm mt-1 text-[#64748d]">탄소 발자국</p>
      </div>

      {/* 에러 */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm bg-red-50 border border-red-100 text-red-600">
          <span>데이터를 불러오는 중 오류가 발생했습니다: {error}</span>
        </div>
      )}

      {/* KPI 카드 */}
      <SummaryCards
        totalCo2e={totalCo2e}
        byCategory={byCategory}
        byMonth={byMonth}
        isLoading={isLoading}
      />

      {/* 탄소 비용 + 카테고리 차트 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 ">
        <CategoryChart byCategory={byCategory} isLoading={isLoading} />
        <CarbonCostCard
          totalCo2e={totalCo2e}
          byCategory={byCategory}
          byMonth={byMonth}
          isLoading={isLoading}
        />
      </div>

      {/* 월별 차트 */}
      <div className="mt-4">
        <MonthlyTrendChart byMonth={byMonth} isLoading={isLoading} />
      </div>
    </div>
  );
}
