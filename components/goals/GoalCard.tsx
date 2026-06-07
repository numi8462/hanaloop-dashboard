import { Trash2, Pencil } from "lucide-react";
import { GoalData } from "@/lib/db/goals";
import ProgressBar from "./ProgressBar";

interface GoalCardProps {
  goal: GoalData;
  currentCo2e: number;
  onDelete: (id: string) => Promise<boolean>;
  onEdit: (goal: GoalData) => void;
  isSaving: boolean;
}

export default function GoalCard({
  goal,
  currentCo2e,
  onDelete,
  onEdit,
  isSaving,
}: GoalCardProps) {
  const pct = ((currentCo2e / goal.targetCo2e) * 100).toFixed(1);
  const remaining = goal.targetCo2e - currentCo2e;
  const isOver = currentCo2e > goal.targetCo2e;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-base font-semibold text-[#0d253d]">
            {goal.year}년 목표
          </p>
          <p className="tnum text-xs text-[#64748d] mt-0.5">
            목표:{" "}
            {goal.targetCo2e.toLocaleString("ko-KR", {
              maximumFractionDigits: 1,
            })}{" "}
            kgCO₂e
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(goal)}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#533afd] hover:bg-[#533afd]/8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-500 hover:bg-red-500/8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <ProgressBar current={currentCo2e} target={goal.targetCo2e} />

      <div className="flex items-center justify-between mt-2">
        <span className="tnum text-xs text-[#64748d]">
          현재{" "}
          {currentCo2e.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}{" "}
          kgCO₂e
        </span>
        <span
          className={`tnum text-xs font-semibold ${isOver ? "text-red-500" : "text-emerald-600"}`}
        >
          {pct}%
        </span>
      </div>

      <div
        className={`mt-3 px-3 py-2 rounded-lg text-xs ${
          isOver
            ? "bg-red-50 border border-red-100 text-red-600"
            : "bg-emerald-50 border border-emerald-100 text-emerald-700"
        }`}
      >
        {isOver ? (
          <>
            목표 초과:{" "}
            <span className="tnum">
              {Math.abs(remaining).toLocaleString("ko-KR", {
                maximumFractionDigits: 1,
              })}{" "}
              kgCO₂e
            </span>
          </>
        ) : (
          <>
            목표까지 남은 감축량:{" "}
            <span className="tnum">
              {remaining.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}{" "}
              kgCO₂e
            </span>
          </>
        )}
      </div>
    </div>
  );
}
