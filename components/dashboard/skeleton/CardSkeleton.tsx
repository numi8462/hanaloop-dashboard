export function CardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4 h-12">
        <div className="flex flex-col gap-1.5">
          <div className="skeleton w-24 h-4" />
          <div className="skeleton w-16 h-3" />
        </div>
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
      <div className="skeleton w-36 h-8 mb-2" />
      <div className="skeleton w-20 h-3 mb-1.5" />
      <div className="skeleton w-28 h-3 mb-1.5" />
      <div className="skeleton w-24 h-3" />
    </div>
  );
}
