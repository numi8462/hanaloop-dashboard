"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { GoalData } from "@/lib/db/goals";

interface GoalFormProps {
  totalCo2e: number;
  isSaving: boolean;
  saveError: string | null;
  successMessage: string | null;
  editTarget?: GoalData | null;
  onSubmit: (year: number, targetCo2e: number) => Promise<boolean>;
  onCancelEdit?: () => void;
  onClearMessages: () => void;
}

export default function GoalForm({
  totalCo2e,
  isSaving,
  saveError,
  successMessage,
  editTarget,
  onSubmit,
  onCancelEdit,
  onClearMessages,
}: GoalFormProps) {
  const [year, setYear] = useState(
    editTarget?.year ?? new Date().getFullYear(),
  );
  const [targetCo2e, setTargetCo2e] = useState(
    editTarget?.targetCo2e ? String(editTarget.targetCo2e) : "",
  );
  const [errors, setErrors] = useState<{ year?: string; targetCo2e?: string }>(
    {},
  );

  // 성공/실패 메시지 4초 후 자동 제거
  useEffect(() => {
    if (saveError || successMessage) {
      const timer = setTimeout(onClearMessages, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveError, successMessage, onClearMessages]);

  function validate() {
    const newErrors: { year?: string; targetCo2e?: string } = {};
    if (!year) newErrors.year = "연도를 입력해주세요.";
    if (!targetCo2e) {
      newErrors.targetCo2e = "목표 배출량을 입력해주세요.";
    } else if (Number(targetCo2e) <= 0) {
      newErrors.targetCo2e = "0보다 큰 값을 입력해주세요.";
    }
    return newErrors;
  }

  async function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const success = await onSubmit(year, Number(targetCo2e));
    if (success) {
      setTargetCo2e("");
      setErrors({});
      onCancelEdit?.();
    }
  }

  return (
    <div className="card p-6 self-start sticky top-6">
      <h3 className="text-base font-semibold text-slate-100 mb-5">
        {editTarget ? "목표 수정" : "목표 설정"}
      </h3>
      <div className="flex flex-col gap-4">
        {/* 연도 */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            연도 <span className="text-red-400">*</span>
          </label>
          <Input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={errors.year ? "border-red-500/50" : ""}
          />
          {errors.year && (
            <p className="mt-1 text-xs text-red-400">{errors.year}</p>
          )}
        </div>

        {/* 목표 배출량 */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            목표 배출량 (kgCO₂e) <span className="text-red-400">*</span>
          </label>
          <Input
            type="number"
            value={targetCo2e}
            onChange={(e) => setTargetCo2e(e.target.value)}
            placeholder="예: 5000"
            className={errors.targetCo2e ? "border-red-500/50" : ""}
          />
          {errors.targetCo2e && (
            <p className="mt-1 text-xs text-red-400">{errors.targetCo2e}</p>
          )}
        </div>

        {/* 현재 배출량 참고 */}
        <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
          현재 총 배출량:{" "}
          <span className="text-slate-200 font-medium">
            {totalCo2e.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}{" "}
            kgCO₂e
          </span>
        </div>

        {/* 에러/성공 메시지 */}
        {saveError && (
          <div className="px-3 py-2.5 rounded-lg text-sm bg-red-500/10 border border-red-500/30 text-red-400">
            {saveError}
          </div>
        )}
        {successMessage && (
          <div className="px-3 py-2.5 rounded-lg text-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {successMessage}
          </div>
        )}

        {/* 버튼 */}
        <div
          className={`grid gap-2 ${editTarget ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {editTarget && (
            <button
              onClick={onCancelEdit}
              className="py-2.5 rounded-lg text-sm font-medium text-slate-400 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              취소
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0b3d91] hover:bg-[#174ea6] disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "저장 중..." : editTarget ? "수정 완료" : "목표 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
