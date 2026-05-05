import CategoryChart from "@/components/dashboard/CategoryChart";
import MonthlyTrendChart from "@/components/dashboard/MontlyTrendChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { CategorySummary, MonthlySummary } from "@/types";

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
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          대시보드
        </h1>
        <p className="text-sm mt-1 text-slate-400">탄소 발자국</p>
      </div>

      {/* 테스트용 더미 데이터 */}
      <SummaryCards
        totalCo2e={5230}
        byCategory={[
          { type: "전기", totalCo2e: 1200, scope: "스코프 2", percentage: 23 },
          {
            type: "원소재",
            totalCo2e: 3200,
            scope: "스코프 3",
            percentage: 61,
          },
          { type: "운송", totalCo2e: 830, scope: "스코프 3", percentage: 16 },
        ]}
        isLoading={false}
      />

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="col-span-1">
          <CategoryChart byCategory={DUMMY_CATEGORY} isLoading={false} />
        </div>
        <div className="col-span-3">
          <MonthlyTrendChart byMonth={DUMMY_MONTHLY} isLoading={false} />
        </div>
      </div>
    </div>
  );
}
