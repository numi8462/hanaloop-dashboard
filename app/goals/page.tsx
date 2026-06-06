"use client";

import { useEffect, useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { useMonthlySummary, useTotalCo2e } from "@/hooks/useDashboard";
import { useDashboardStore } from "@/store/dashboardStore";
import GoalForm from "@/components/goals/GoalForm";
import GoalCard from "@/components/goals/GoalCard";
import GoalCardSkeleton from "@/components/goals/skeletons/GoalCardSkeleton";
import { GoalData } from "@/lib/db/goals";

export default function GoalsPage() {
  const [editTarget, setEditTarget] = useState<GoalData | null>(null);

  const {
    goals,
    isLoading,
    isSaving,
    saveError,
    successMessage,
    upsertGoal,
    deleteGoal,
    clearMessages,
  } = useGoals();

  const totalCo2e = useTotalCo2e();
  const byMonth = useMonthlySummary();
  const { fetchData } = useDashboardStore();

  useEffect(() => {
    fetchData();
  }, []);

  function getCo2eByYear(year: number): number {
    return byMonth
      .filter((m) => m.yearMonth.startsWith(String(year)))
      .reduce(
        (sum, m) => sum + Object.values(m.byType).reduce((s, v) => s + v, 0),
        0,
      );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          목표 관리
        </h1>
        <p className="text-sm mt-1 text-slate-400">
          연도별 탄소 감축 목표를 설정하고 진행률을 확인합니다
        </p>
      </div>

      <div
        className="flex flex-col lg:grid lg:gap-6 gap-6"
        style={{ gridTemplateColumns: "320px 1fr" }}
      >
        {/* 목표 설정/수정 폼 */}
        <GoalForm
          key={editTarget?.id ?? "new"}
          totalCo2e={totalCo2e}
          isSaving={isSaving}
          saveError={saveError}
          successMessage={successMessage}
          editTarget={editTarget}
          onSubmit={upsertGoal}
          onCancelEdit={() => setEditTarget(null)}
          onClearMessages={clearMessages}
        />

        {/* 목표 목록 */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <GoalCardSkeleton key={i} />
            ))
          ) : goals.length === 0 ? (
            <div className="card p-12 text-center text-sm text-slate-400">
              설정된 목표가 없습니다. 왼쪽 폼에서 목표를 추가해주세요.
            </div>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                currentCo2e={getCo2eByYear(goal.year)}
                onDelete={deleteGoal}
                onEdit={setEditTarget}
                isSaving={isSaving}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
