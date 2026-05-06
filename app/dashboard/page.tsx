"use client";

import CategoryChart from "@/components/dashboard/CategoryChart";
import MonthlyTrendChart from "@/components/dashboard/MontlyTrendChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import {
  useCategorySummary,
  useMonthlySummary,
  useTotalCo2e,
} from "@/hooks/useDashboard";
import { useDashboardStore } from "@/store/dashboardStore";
import { useEffect } from "react";

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
