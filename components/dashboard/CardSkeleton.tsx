export function CardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton w-24 h-4" />
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
      <div className="skeleton w-36 h-8 mb-2" />
      <div className="skeleton w-16 h-3" />
    </div>
  );
}
