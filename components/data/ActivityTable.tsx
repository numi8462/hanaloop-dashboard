"use client";

import { useState } from "react";
import { ActivityData, EmissionType } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import TableSkeleton from "./skeleton/TableSkeleton";
import { TYPE_BADGE } from "@/constants/colors";
import { ACTIVITY_TABLE_COLUMNS } from "@/constants/tableColumns";

interface ActivityTableProps {
  activities: ActivityData[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<boolean>;
  onEdit: (activity: ActivityData) => void;
  isSaving: boolean;
}

export default function ActivityTable({
  activities,
  isLoading,
  onDelete,
  onEdit,
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
    <div className="card overflow-hidden min-w-0">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e8ee]">
        <h3 className="text-base font-semibold text-[#0d253d]">
          활동 데이터 목록
        </h3>
        <span className="tnum text-sm text-[#64748d]">총 {activities.length}건</span>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
        <table className="w-full min-w-150 text-sm">
          <thead>
            <tr className="bg-[#f6f9fc]">
              {ACTIVITY_TABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#64748d] tracking-wider"
                >
                  {col.label}
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
                  className="px-4 py-12 text-center text-sm text-[#64748d]"
                >
                  활동 데이터가 없습니다. 위 폼에서 데이터를 추가해주세요.
                </td>
              </tr>
            ) : (
              activities.map((activity) => {
                const badge = TYPE_BADGE[activity.type as EmissionType] ?? {
                  bg: "bg-[#f0efff]",
                  text: "text-[#533afd]",
                };

                return (
                  <tr
                    key={activity.id}
                    className="border-b border-[#e3e8ee] hover:bg-[#f6f9fc] transition-colors"
                  >
                    <td className="tnum px-4 py-3 text-[#64748d]">
                      {activity.date.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}
                      >
                        {activity.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0d253d]">
                      {activity.description}
                    </td>
                    <td className="tnum px-4 py-3 text-[#0d253d]">
                      {activity.amount.toLocaleString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-[#64748d]">
                      {activity.unit}
                    </td>
                    <td className="px-2 py-3 w-px whitespace-nowrap">
                      <button
                        onClick={() => onEdit(activity)}
                        disabled={isSaving}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#533afd] hover:bg-[#f0efff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        disabled={isSaving || deletingId === activity.id}
                        className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
