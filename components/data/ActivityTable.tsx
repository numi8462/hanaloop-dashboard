"use client";

import { useState } from "react";
import { ActivityData, EmissionType } from "@/types";
import { Trash2 } from "lucide-react";

// 유형별 배지 스타일
const TYPE_BADGE: Record<EmissionType, { bg: string; text: string }> = {
  전기: { bg: "bg-[#e8f0f9]", text: "text-[#08428C]" },
  원소재: { bg: "bg-[#edf6fd]", text: "text-[#2995D9]" },
  운송: { bg: "bg-[#f0faff]", text: "text-[#79CFF2]" },
};

interface ActivityTableProps {
  activities: ActivityData[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<boolean>;
  isSaving: boolean;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-slate-100">
          {Array.from({ length: 6 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="skeleton h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function ActivityTable({
  activities,
  isLoading,
  onDelete,
  isSaving,
}: ActivityTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("이 데이터를 삭제하시겠습니까?")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  return (
    <div className="card overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900">
          활동 데이터 목록
        </h3>
        <span className="text-sm text-slate-400">총 {activities.length}건</span>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto overflow-y-auto max-h-150">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["날짜", "유형", "설명", "수량", "단위", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton />
            ) : activities.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  활동 데이터가 없습니다. 위 폼에서 데이터를 추가해주세요.
                </td>
              </tr>
            ) : (
              activities.map((activity) => {
                const badge = TYPE_BADGE[activity.type as EmissionType] ?? {
                  bg: "bg-slate-100",
                  text: "text-slate-500",
                };

                return (
                  <tr
                    key={activity.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400">
                      {activity.date.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}
                      >
                        {activity.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {activity.description}
                    </td>
                    <td className="px-4 py-3 text-slate-900">
                      {activity.amount.toLocaleString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {activity.unit}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(activity.id)}
                        disabled={isSaving || deletingId === activity.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
