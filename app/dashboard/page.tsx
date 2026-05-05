import CategoryChart from "@/components/dashboard/CategoryChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { CategorySummary } from "@/types";

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

      <div className="mt-6">
        <CategoryChart byCategory={DUMMY_CATEGORY} isLoading={false} />
      </div>
    </div>
  );
}
