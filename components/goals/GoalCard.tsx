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
          <p className="text-base font-semibold text-slate-100">
            {goal.year}년 목표
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#2995D9] hover:bg-[#2995D9]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <ProgressBar current={currentCo2e} target={goal.targetCo2e} />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-slate-400">
          현재{" "}
          {currentCo2e.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}{" "}
          kgCO₂e
        </span>
        <span
          className={`text-xs font-semibold ${isOver ? "text-red-400" : "text-emerald-400"}`}
        >
          {pct}%
        </span>
      </div>

      <div
        className={`mt-3 px-3 py-2 rounded-lg text-xs ${
          isOver
            ? "bg-red-500/10 border border-red-500/20 text-red-400"
            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
        }`}
      >
        {isOver ? (
          <>
            목표 초과:{" "}
            {Math.abs(remaining).toLocaleString("ko-KR", {
              maximumFractionDigits: 1,
            })}{" "}
            kgCO₂e
          </>
        ) : (
          <>
            목표까지 남은 감축량:{" "}
            {remaining.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}{" "}
            kgCO₂e
          </>
        )}
      </div>
    </div>
  );
}
