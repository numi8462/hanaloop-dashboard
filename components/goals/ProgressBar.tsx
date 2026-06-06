interface ProgressBarProps {
  current: number;
  target: number;
}

export default function ProgressBar({ current, target }: ProgressBarProps) {
  const pct = Math.min((current / target) * 100, 100);
  const isOver = current > target;

  return (
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all ${
          isOver ? "bg-red-500" : pct > 80 ? "bg-amber-400" : "bg-emerald-400"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
