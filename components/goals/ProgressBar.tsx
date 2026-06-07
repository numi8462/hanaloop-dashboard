interface ProgressBarProps {
  current: number;
  target: number;
}

export default function ProgressBar({ current, target }: ProgressBarProps) {
  const pct = Math.min((current / target) * 100, 100);
  const isOver = current > target;

  return (
    <div className="w-full bg-[#e3e8ee] rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all ${
          isOver ? "bg-red-500" : pct > 80 ? "bg-amber-400" : "bg-emerald-500"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
