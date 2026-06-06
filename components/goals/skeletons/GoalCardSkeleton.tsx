export default function GoalCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="skeleton h-5 w-28 mb-1.5" />
          <div className="skeleton h-3 w-40" />
        </div>
        <div className="skeleton w-7 h-7 rounded-lg" />
      </div>
      <div className="skeleton h-2 w-full mb-2" />
      <div className="flex justify-between">
        <div className="skeleton h-3 w-36" />
        <div className="skeleton h-3 w-10" />
      </div>
      <div className="skeleton h-8 w-full mt-3 rounded-lg" />
    </div>
  );
}
