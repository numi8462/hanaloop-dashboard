"use client";

import { useActivities } from "@/hooks/useActivities";
import { useDashboardStore } from "@/store/dashboardStore";
import ActivityForm from "@/components/data/ActivityForm";
import ActivityTable from "@/components/data/ActivityTable";
import { ActivityInput } from "@/types";
import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function DataPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    <div className="p-6 lg:p-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            데이터 관리
          </h1>
          <p className="text-sm mt-1 text-slate-400">
            전기, 원소재, 운송 등 탄소 배출 활동 데이터를 입력·관리합니다
          </p>
        </div>
        {/* 모바일에서만 보이는 토글 버튼 */}
        <button
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#08428C] hover:bg-[#05285a] transition-colors"
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? "닫기" : "데이터 추가"}
        </button>
      </div>

      {/* 모바일 폼 (토글) */}
      {isFormOpen && (
        <div className="lg:hidden mb-6">
          <ActivityForm
            onSubmit={handleCreate}
            isSaving={isSaving}
            saveError={saveError}
            successMessage={successMessage}
            onClearMessages={clearMessages}
          />
        </div>
      )}

      {/* 데스크탑 레이아웃 */}
      <div
        className="flex flex-col lg:grid lg:gap-6 gap-6"
        style={{ gridTemplateColumns: "320px 1fr" }}
      >
        {/* 데스크탑에서만 보이는 폼 */}
        <div className="hidden lg:block self-start sticky top-6">
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
