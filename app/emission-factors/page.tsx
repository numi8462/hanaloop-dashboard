"use client";

import { useState, useEffect } from "react";
import { EmissionType } from "@/types";
import { useEmissionFactors } from "@/hooks/useEmissionFactors";
import { TYPE_BADGE } from "@/constants/colors";
import { EMISSION_FACTOR_COLUMNS } from "@/constants/tableColumns";
import TableSkeleton from "@/components/data/skeleton/TableSkeleton";
import { Pencil, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EmissionFactorsPage() {
  const {
    factors,
    isLoading,
    isSaving,
    error,
    saveError,
    successMessage,
    updateFactor,
    activateFactor,
    clearMessages,
  } = useEmissionFactors();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // 메시지 4초 후 자동 제거
  useEffect(() => {
    if (saveError || successMessage) {
      const timer = setTimeout(clearMessages, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveError, successMessage, clearMessages]);

  async function handleUpdate(id: string) {
    if (!editValue || Number(editValue) <= 0) return;
    const success = await updateFactor(id, Number(editValue));
    if (success) {
      setEditingId(null);
      setEditValue("");
    }
  }

  const activeFactors = factors.filter((f) => f.isActive);
  const inactiveFactors = factors.filter((f) => !f.isActive);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#0d253d]"
          style={{ letterSpacing: "-0.64px" }}
        >
          배출계수 관리
        </h1>
        <p className="text-sm mt-1 text-[#64748d]">
          GHG 배출계수를 관리하고 버전 이력을 추적합니다
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg mb-6 text-sm bg-red-50 border border-red-100 text-red-600">
          {error}
        </div>
      )}
      {saveError && (
        <div className="px-4 py-3 rounded-lg mb-6 text-sm bg-red-50 border border-red-100 text-red-600">
          {saveError}
        </div>
      )}
      {successMessage && (
        <div className="px-4 py-3 rounded-lg mb-6 text-sm bg-green-50 border border-green-100 text-green-600">
          {successMessage}
        </div>
      )}

      {/* 현재 유효한 배출계수 */}
      <div className="card overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8ee]">
          <h3 className="font-semibold text-[#0d253d]">현재 유효한 배출계수</h3>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
          <table className="w-full min-w-150 text-sm">
            <thead>
              <tr className="bg-[#f6f9fc]">
                {[...EMISSION_FACTOR_COLUMNS, { key: "action", label: "" }].map(
                  (col) => (
                    <th
                      key={col.key}
                      className="px-5 py-3 text-left text-xs font-semibold text-[#64748d] tracking-wider"
                    >
                      {col.label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                activeFactors.map((f) => {
                  const badge = TYPE_BADGE[f.type as EmissionType] ?? {
                    bg: "bg-[#f0efff]",
                    text: "text-[#533afd]",
                  };
                  const isEditing = editingId === f.id;

                  return (
                    <tr
                      key={f.id}
                      className="border-b border-[#e3e8ee] hover:bg-[#f6f9fc] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}
                        >
                          {f.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-[#0d253d]">
                        {f.description}
                      </td>
                      <td className="tnum px-5 py-4 font-semibold text-[#533afd]">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-28"
                            autoFocus
                          />
                        ) : (
                          f.emissionFactor
                        )}
                      </td>
                      <td className="px-5 py-4 text-[#64748d]">{f.unit}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#f0efff] text-[#533afd]">
                          v{f.version}
                        </span>
                      </td>
                      <td className="tnum px-5 py-4 text-xs text-[#64748d]">
                        {f.validFrom.slice(0, 10)}
                      </td>
                      <td className="px-5 py-4 w-px whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdate(f.id)}
                              disabled={isSaving}
                              className="text-xs px-2 py-1 rounded-lg bg-[#533afd] text-white hover:bg-[#4434d4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditValue("");
                              }}
                              className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(f.id);
                              setEditValue(String(f.emissionFactor));
                            }}
                            disabled={isSaving}
                            className="p-1.5 rounded-lg text-[#64748d] hover:text-[#533afd] hover:bg-[#f0efff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 버전 이력 */}
      {inactiveFactors.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8ee]">
            <h3 className="font-semibold text-[#0d253d]">버전 이력</h3>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-slate-100 text-slate-500">
              Archived
            </span>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[60vh]">
            <table className="w-full min-w-150 text-sm">
              <thead>
                <tr className="bg-[#f6f9fc]">
                  {[
                    "유형",
                    "설명",
                    "배출계수",
                    "단위",
                    "버전",
                    "적용 기간",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-[#64748d] tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inactiveFactors.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-[#e3e8ee] opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <td className="px-5 py-3 text-xs text-[#64748d]">
                      {f.type}
                    </td>
                    <td className="px-5 py-3 text-[#64748d]">
                      {f.description}
                    </td>
                    <td className="tnum px-5 py-3 line-through text-[#64748d]">
                      {f.emissionFactor}
                    </td>
                    <td className="px-5 py-3 text-xs text-[#64748d]">
                      {f.unit}
                    </td>
                    <td className="px-5 py-3 text-xs text-[#64748d]">
                      v{f.version}
                    </td>
                    <td className="px-5 py-3 text-xs text-[#64748d]">
                      {f.validFrom.slice(0, 10)} ~{" "}
                      {f.validTo?.slice(0, 10) ?? "현재"}
                    </td>
                    <td className="px-5 py-3 w-px whitespace-nowrap">
                      <button
                        onClick={() => activateFactor(f.id)}
                        disabled={isSaving}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-[#64748d] hover:text-[#533afd] hover:bg-[#f0efff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RotateCcw size={12} />이 버전 적용
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
