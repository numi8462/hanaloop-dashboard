export default function CategoryChartSkeleton() {
  return (
    <div className="card p-5 h-80">
      <div className="skeleton w-32 h-5 mb-10 " />
      <div className="flex items-end justify-center h-40">
        <div className="skeleton w-55 h-40 rounded-t-full" />
      </div>
    </div>
  );
}
