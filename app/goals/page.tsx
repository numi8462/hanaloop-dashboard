"use client";

import { useEffect } from "react";
import { useGoals } from "@/hooks/useGoals";
import { useTotalCo2e } from "@/hooks/useDashboard";
import { useDashboardStore } from "@/store/dashboardStore";
import GoalForm from "@/components/goals/GoalForm";
import GoalCard from "@/components/goals/GoalCard";
import GoalCardSkeleton from "@/components/goals/skeletons/GoalCardSkeleton";

export default function GoalsPage() {
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
  const { fetchData } = useDashboardStore();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* 헤더 */}
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
        {/* 목표 설정 폼 */}
        <GoalForm
          totalCo2e={totalCo2e}
          isSaving={isSaving}
          saveError={saveError}
          successMessage={successMessage}
          onSubmit={upsertGoal}
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
                currentCo2e={totalCo2e}
                onDelete={deleteGoal}
                isSaving={isSaving}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
