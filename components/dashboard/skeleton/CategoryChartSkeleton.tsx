export default function CategoryChartSkeleton() {
  return (
    <div className="card p-5 h-full">
      <div className="skeleton w-32 h-5 mb-5" />
      <div className="flex items-center justify-center flex-1 h-40">
        <div className="skeleton w-55 h-30 rounded-t-full" />
      </div>
    </div>
  );
}
