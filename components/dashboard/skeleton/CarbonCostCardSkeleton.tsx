export default function CarbonCostCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3 h-12">
        <div className="flex-1 mr-2">
          <div className="skeleton h-4 w-24 mb-2" />
          <div className="skeleton h-3 w-32" />
        </div>
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
      <div className="flex items-baseline gap-1.5 mb-3">
        <div className="skeleton h-8 w-36" />
        <div className="skeleton h-4 w-6" />
      </div>
      <div className="flex items-center gap-2">
        <div className="skeleton h-4 w-8" />
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  );
}
