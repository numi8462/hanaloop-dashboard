"use client";

import { useActivities } from "@/hooks/useActivities";
import { useDashboardStore } from "@/store/dashboardStore";
import ActivityForm from "@/components/data/ActivityForm";
import ActivityTable from "@/components/data/ActivityTable";
import { ActivityInput } from "@/types";

export default function DataPage() {
  const {
    activities,
    isLoading,
    isSaving,
    saveError,
    successMessage,
    createActivity,
    deleteActivity,
    clearMessages,
  } = useActivities();

  // 활동 데이터 수정 후 대시보드 캐시 무효화
  const invalidateDashboard = useDashboardStore((s) => s.invalidate);

  async function handleCreate(input: ActivityInput): Promise<boolean> {
    const success = await createActivity(input);
    if (success) invalidateDashboard();
    return success;
  }

  async function handleDelete(id: string): Promise<boolean> {
    const success = await deleteActivity(id);
    if (success) invalidateDashboard();
    return success;
  }

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          데이터 관리
        </h1>
        <p className="text-sm mt-1 text-slate-400">
          전기, 원소재, 운송 등 탄소 배출 활동 데이터를 입력·관리합니다
        </p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "320px 1fr" }}>
        {/* 입력 폼 */}
        <div className="self-start sticky top-6">
          <ActivityForm
            onSubmit={handleCreate}
            isSaving={isSaving}
            saveError={saveError}
            successMessage={successMessage}
            onClearMessages={clearMessages}
          />
        </div>

        {/* 테이블 */}
        <ActivityTable
          activities={activities}
          isLoading={isLoading}
          onDelete={handleDelete}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
